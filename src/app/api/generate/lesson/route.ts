import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, handleApiError, auditLog } from "@/lib/api-utils"
import { generateContent, LESSON_PLAN_PROMPT } from "@/services/openai"
import { rateLimit } from "@/lib/rate-limit"
import { generateLessonSchema } from "@/validations"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) return errorResponse("Unauthorized", 401)

    const ip = request.headers.get("x-forwarded-for") || "unknown"
    const rateLimitResult = await rateLimit(`generate:${session.user.id}`, 20, 60000)
    if (!rateLimitResult.success) {
      return errorResponse("Rate limit exceeded. Please wait before generating more documents.", 429)
    }

    const body = await request.json()
    const parsed = generateLessonSchema.safeParse(body)
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 400)
    }

    const { gradeLevel, subject, term, week, strand, subStrand, topic } = parsed.data

    const prompt = `${LESSON_PLAN_PROMPT}

Generate a detailed CBC lesson plan for:
- Grade Level: ${gradeLevel}
- Subject: ${subject}
- Term: ${term}
- Week: ${week}
- Strand: ${strand}
- Sub Strand: ${subStrand}
- Topic: ${topic}

Ensure the lesson plan follows CBC guidelines and includes all required components.`

    const content = await generateContent({
      prompt,
      format: "json",
      temperature: 0.7,
    })

    let parsedContent
    try {
      parsedContent = JSON.parse(content)
    } catch {
      parsedContent = { raw: content }
    }

    const document = await prisma.generatedLesson.create({
      data: {
        userId: session.user.id,
        title: `${subject} - ${topic}`,
        gradeLevel: gradeLevel as any,
        subject,
        curriculum: "CBC",
        content: parsedContent,
      },
    })

    // Also save as document
    await prisma.document.create({
      data: {
        userId: session.user.id,
        title: `Lesson Plan: ${subject} - ${topic}`,
        type: "LESSON_PLAN",
        content: parsedContent,
        subject,
        gradeLevel: gradeLevel as any,
        tags: [subject, gradeLevel, topic],
      },
    })

    await auditLog(session.user.id, "GENERATE_LESSON", "GeneratedLesson", document.id, {
      subject,
      gradeLevel,
      topic,
    })

    return successResponse({ content: parsedContent, id: document.id }, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
