import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, handleApiError, auditLog } from "@/lib/api-utils"
import { generateContent, EXAM_PROMPT } from "@/services/openai"
import { rateLimit } from "@/lib/rate-limit"
import { generateExamSchema } from "@/validations"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) return errorResponse("Unauthorized", 401)

    const rateLimitResult = await rateLimit(`generate:${session.user.id}`, 20, 60000)
    if (!rateLimitResult.success) {
      return errorResponse("Rate limit exceeded", 429)
    }

    const body = await request.json()
    const parsed = generateExamSchema.safeParse(body)
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 400)
    }

    const { gradeLevel, subject, examType, questionTypes, totalMarks, duration } = parsed.data

    const prompt = `${EXAM_PROMPT}

Generate a CBC ${examType} exam for:
- Grade Level: ${gradeLevel}
- Subject: ${subject}
- Exam Type: ${examType}
- Total Marks: ${totalMarks}
- Duration: ${duration} minutes
- Question Types to include: ${questionTypes.join(", ")}

Include clear instructions and appropriate difficulty level for the grade.`

    const content = await generateContent({ prompt, format: "json" })

    let parsedContent
    try {
      parsedContent = JSON.parse(content)
    } catch {
      parsedContent = { raw: content }
    }

    const exam = await prisma.exam.create({
      data: {
        userId: session.user.id,
        title: `${subject} ${examType} - Grade ${gradeLevel}`,
        examType: examType as any,
        gradeLevel: gradeLevel as any,
        subject,
        duration: parseInt(String(duration)),
        totalMarks: parseInt(String(totalMarks)),
        content: parsedContent,
      },
    })

    await prisma.document.create({
      data: {
        userId: session.user.id,
        title: `Exam: ${subject} ${examType}`,
        type: "EXAM",
        content: parsedContent,
        subject,
        gradeLevel: gradeLevel as any,
        tags: [subject, gradeLevel, examType],
      },
    })

    await auditLog(session.user.id, "GENERATE_EXAM", "Exam", exam.id, {
      subject,
      examType,
      totalMarks,
    })

    return successResponse({ content: parsedContent, id: exam.id }, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
