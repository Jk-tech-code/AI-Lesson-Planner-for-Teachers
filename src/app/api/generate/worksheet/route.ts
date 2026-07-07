import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, handleApiError, auditLog } from "@/lib/api-utils"
import { generateContent } from "@/services/openai"
import { rateLimit } from "@/lib/rate-limit"
import { generateWorksheetSchema } from "@/validations"

const WORKSHEET_PROMPT = `Generate a CBC worksheet in JSON format with the following structure:
{
  "title": "Worksheet title",
  "subject": "Subject name",
  "gradeLevel": "Grade level",
  "topic": "Topic covered",
  "instructions": "Clear instructions for the student",
  "questions": [
    {
      "type": "mcq, fill_blanks, true_false, matching, practical, or project",
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Correct answer or answer key",
      "marks": 2
    }
  ],
  "answerKey": "Answer key with correct answers if requested"
}`

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) return errorResponse("Unauthorized", 401)

    const rateLimitResult = await rateLimit(`generate:${session.user.id}`, 20, 60000)
    if (!rateLimitResult.success) {
      return errorResponse("Rate limit exceeded", 429)
    }

    const body = await request.json()
    const parsed = generateWorksheetSchema.safeParse(body)
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 400)
    }

    const { gradeLevel, subject, topic, questionType, questionCount, difficulty, includeAnswerKey } = parsed.data

    const prompt = `${WORKSHEET_PROMPT}\n\nGenerate a CBC worksheet for:\n- Grade Level: ${gradeLevel}\n- Subject: ${subject}\n- Topic: ${topic}\n- Question Type: ${questionType}\n- Number of Questions: ${questionCount}\n- Difficulty Level: ${difficulty}\n- Include Answer Key: ${includeAnswerKey ? "Yes" : "No"}\n\nCreate age-appropriate questions suitable for the grade level. Include a mix of difficulty levels within the worksheet. Questions should be clear and directly test understanding of the topic.`

    const content = await generateContent({ prompt, format: "json" })

    let parsedContent
    try {
      parsedContent = JSON.parse(content)
    } catch {
      parsedContent = { raw: content }
    }

    const worksheet = await prisma.worksheet.create({
      data: {
        userId: session.user.id,
        title: `${subject} - ${topic} Worksheet`,
        content: parsedContent,
      },
    })

    await prisma.document.create({
      data: {
        userId: session.user.id,
        title: `Worksheet: ${subject} - ${topic}`,
        type: "WORKSHEET",
        content: parsedContent,
        subject,
        gradeLevel: gradeLevel as any,
        tags: [subject, gradeLevel, topic],
      },
    })

    await auditLog(session.user.id, "GENERATE_WORKSHEET", "Worksheet", worksheet.id, {
      subject,
      gradeLevel,
      topic,
    })

    return successResponse({ content: parsedContent, id: worksheet.id }, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
