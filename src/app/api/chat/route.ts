import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, handleApiError } from "@/lib/api-utils"
import { generateContent } from "@/services/openai"
import { rateLimit } from "@/lib/rate-limit"

const CHAT_SYSTEM_PROMPT = `You are an expert AI Teaching Assistant for the Kenya Competency Based Curriculum (CBC).
You help teachers with:
- Creating and improving lesson plans
- Generating exam questions and assessments
- Explaining curriculum concepts
- Suggesting teaching strategies and activities
- Providing CBC curriculum guidance
- Creating schemes of work
- Developing teaching resources

Be helpful, accurate, and professional. Use proper educational terminology.
Keep responses clear and actionable. When generating structured content like questions or plans, format them clearly.`

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) return errorResponse("Unauthorized", 401)

    const rateLimitResult = await rateLimit(`chat:${session.user.id}`, 30, 60000)
    if (!rateLimitResult.success) {
      return errorResponse("Rate limit exceeded. Please wait before sending more messages.", 429)
    }

    const { message, history } = await request.json()

    if (!message || typeof message !== "string") {
      return errorResponse("Message is required", 400)
    }

    const messages = [
      { role: "system" as const, content: CHAT_SYSTEM_PROMPT },
      ...(history || []).slice(-10).map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user" as const, content: message },
    ]

    const response = await generateContent({
      prompt: messages[messages.length - 1].content,
      systemPrompt: messages[0].content,
      temperature: 0.7,
      maxTokens: 2000,
    })

    await prisma.chatMessage.create({
      data: {
        userId: session.user.id,
        role: "user",
        content: message,
      },
    })

    await prisma.chatMessage.create({
      data: {
        userId: session.user.id,
        role: "assistant",
        content: response,
      },
    })

    return successResponse({ response })
  } catch (error) {
    return handleApiError(error)
  }
}
