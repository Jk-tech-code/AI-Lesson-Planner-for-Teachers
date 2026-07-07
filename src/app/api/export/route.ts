import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { successResponse, errorResponse, handleApiError } from "@/lib/api-utils"
import { exportToPdf, exportToWord, exportToPowerPoint, exportToExcel, getDocumentContent } from "@/services/export"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) return errorResponse("Unauthorized", 401)

    const { searchParams } = new URL(request.url)
    const documentId = searchParams.get("documentId")
    const format = searchParams.get("format") || "pdf"

    if (!documentId) return errorResponse("Document ID is required", 400)

    const doc = await getDocumentContent(documentId, session.user.id)
    if (!doc) return errorResponse("Document not found", 404)

    let buffer: Buffer
    const exportData = {
      title: doc.title,
      type: doc.type,
      content: doc.content,
    }

    switch (format) {
      case "pdf":
        buffer = await exportToPdf(exportData)
        break
      case "word":
        buffer = await exportToWord(exportData)
        break
      case "powerpoint":
        buffer = await exportToPowerPoint(exportData)
        break
      case "excel":
        buffer = await exportToExcel(exportData)
        break
      default:
        return errorResponse("Unsupported format", 400)
    }

    const mimeTypes: Record<string, string> = {
      pdf: "application/pdf",
      word: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      powerpoint: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      excel: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }

    const extension = format === "powerpoint" ? "pptx" : format

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": mimeTypes[format] || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${doc.title}.${extension}"`,
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}
