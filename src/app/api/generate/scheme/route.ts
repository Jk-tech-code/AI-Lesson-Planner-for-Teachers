import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, handleApiError, auditLog } from "@/lib/api-utils"
import { generateContent, SCHEME_PROMPT } from "@/services/openai"
import { rateLimit } from "@/lib/rate-limit"
import { generateSchemeSchema } from "@/validations"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) return errorResponse("Unauthorized", 401)

    const rateLimitResult = await rateLimit(`generate:${session.user.id}`, 20, 60000)
    if (!rateLimitResult.success) {
      return errorResponse("Rate limit exceeded", 429)
    }

    const body = await request.json()
    const parsed = generateSchemeSchema.safeParse(body)
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 400)
    }

    const { gradeLevel, subject, term, weekCount, strand, subStrand } = parsed.data

    const prompt = `${SCHEME_PROMPT}

Generate a CBC scheme of work for:
- Grade Level: ${gradeLevel}
- Subject: ${subject}
- Term: ${term}
- Number of Weeks: ${weekCount}
- Strand: ${strand}
- Sub Strand: ${subStrand}

Create ${weekCount} weeks of comprehensive scheme entries following CBC guidelines.`

    const content = await generateContent({ prompt, format: "json" })

    let parsedContent
    try {
      parsedContent = JSON.parse(content)
    } catch {
      parsedContent = { raw: content }
    }

    const scheme = await prisma.schemeOfWork.create({
      data: {
        userId: session.user.id,
        title: `${subject} - ${term} Scheme of Work`,
        gradeLevel: gradeLevel as any,
        subject,
        content: parsedContent,
        weekCount: parseInt(String(weekCount)),
      },
    })

    await prisma.document.create({
      data: {
        userId: session.user.id,
        title: `Scheme of Work: ${subject} - ${term}`,
        type: "SCHEME_OF_WORK",
        content: parsedContent,
        subject,
        gradeLevel: gradeLevel as any,
        tags: [subject, gradeLevel, term],
      },
    })

    await auditLog(session.user.id, "GENERATE_SCHEME", "SchemeOfWork", scheme.id, {
      subject,
      gradeLevel,
      term,
    })

    return successResponse({ content: parsedContent, id: scheme.id }, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
