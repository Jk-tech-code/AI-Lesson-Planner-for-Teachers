import { prisma } from "@/lib/prisma"
import type { Document, GeneratedLesson } from "@prisma/client"

export interface ExportData {
  title: string
  type: string
  content: any
  metadata?: Record<string, any>
}

export async function exportToPdf(data: ExportData): Promise<Buffer> {
  // For production, use a PDF library like @react-pdf/renderer or puppeteer
  // This is a stub for the export service
  const content = generateHtmlContent(data)
  return Buffer.from(content)
}

export async function exportToWord(data: ExportData): Promise<Buffer> {
  // For production, use docx or similar library
  const content = generateHtmlContent(data)
  return Buffer.from(content)
}

export async function exportToPowerPoint(data: ExportData): Promise<Buffer> {
  // For production, use pptxgenjs or similar
  const content = generateHtmlContent(data)
  return Buffer.from(content)
}

export async function exportToExcel(data: ExportData): Promise<Buffer> {
  // For production, use exceljs
  const content = generateHtmlContent(data)
  return Buffer.from(content)
}

function generateHtmlContent(data: ExportData): string {
  const content = typeof data.content === "string"
    ? data.content
    : JSON.stringify(data.content, null, 2)

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${data.title}</title>
  <style>
    body { font-family: 'Inter', sans-serif; padding: 2em; line-height: 1.6; }
    h1 { font-size: 1.5em; margin-bottom: 0.5em; }
    pre { white-space: pre-wrap; font-family: monospace; }
  </style>
</head>
<body>
  <h1>${data.title}</h1>
  <p>Type: ${data.type.replace(/_/g, " ")}</p>
  <pre>${content}</pre>
</body>
</html>`
}

export async function getDocumentContent(documentId: string, userId: string) {
  const doc = await prisma.document.findFirst({
    where: { id: documentId, userId },
  })
  return doc
}

export async function getLessonContent(lessonId: string, userId: string) {
  const lesson = await prisma.generatedLesson.findFirst({
    where: { id: lessonId, userId },
  })
  return lesson
}
