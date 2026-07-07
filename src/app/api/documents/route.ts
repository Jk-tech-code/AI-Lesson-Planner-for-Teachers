import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, handleApiError } from "@/lib/api-utils"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) return errorResponse("Unauthorized", 401)

    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query") || ""
    const type = searchParams.get("type")
    const subject = searchParams.get("subject")
    const gradeLevel = searchParams.get("gradeLevel")
    const folderId = searchParams.get("folderId")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")

    const where: any = {
      userId: session.user.id,
      isArchived: false,
    }

    if (type && type !== "all") where.type = type
    if (subject) where.subject = subject
    if (gradeLevel) where.gradeLevel = gradeLevel
    if (folderId) where.folderId = folderId
    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { tags: { has: query } },
      ]
    }

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.document.count({ where }),
    ])

    return successResponse({
      documents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) return errorResponse("Unauthorized", 401)

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) return errorResponse("Document ID is required", 400)

    const doc = await prisma.document.findFirst({
      where: { id, userId: session.user.id },
    })

    if (!doc) return errorResponse("Document not found", 404)

    await prisma.document.update({
      where: { id },
      data: { isArchived: true },
    })

    return successResponse({ message: "Document archived" })
  } catch (error) {
    return handleApiError(error)
  }
}
