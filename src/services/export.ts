import { prisma } from "@/lib/prisma"

export interface ExportData {
  title: string
  type: string
  content: any
  metadata?: Record<string, any>
}

// ---------------------------------------------------------------------------
// PDF – clean HTML that can be printed or converted by puppeteer later
// ---------------------------------------------------------------------------
export async function exportToPdf(data: ExportData): Promise<Buffer> {
  const html = buildHtmlDocument(data)
  return Buffer.from(html)
}

// ---------------------------------------------------------------------------
// Excel – styled workbook with exceljs
// ---------------------------------------------------------------------------
export async function exportToExcel(data: ExportData): Promise<Buffer> {
  const ExcelJS = await import("exceljs")
  const workbook = new ExcelJS.Workbook()
  workbook.creator = "AI Lesson Planner"
  workbook.created = new Date()

  const sheet = workbook.addWorksheet("Document")

  // Title & metadata rows
  const titleRow = sheet.addRow([data.title])
  titleRow.font = { bold: true, size: 14, name: "Calibri" }
  sheet.mergeCells("A1:C1")

  sheet.addRow([`Type: ${data.type.replace(/_/g, " ")}`]).font = {
    italic: true,
    size: 11,
    color: { argb: "FF666666" },
  }
  sheet.addRow([]) // spacer

  // Header row
  const headers = ["#", "Section / Question", "Details", "Marks"]
  const headerRow = sheet.addRow(headers)
  headerRow.eachCell((cell: any) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" }, name: "Calibri" }
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4F46E5" },
    }
    cell.alignment = { horizontal: "center", vertical: "middle" }
    cell.border = {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    }
  })

  // Data rows
  const rows = flattenContent(data.content)
  for (const item of rows) {
    const row = sheet.addRow(item)
    row.eachCell((cell: any) => {
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      }
      cell.alignment = { vertical: "top", wrapText: true }
    })
  }

  // Auto-fit columns
  sheet.columns = [
    { header: "#", key: "index", width: 5 },
    { header: "Section / Question", key: "section", width: 40 },
    { header: "Details", key: "details", width: 50 },
    { header: "Marks", key: "marks", width: 10 },
  ]

  const buf = await workbook.xlsx.writeBuffer()
  return Buffer.from(buf as ArrayBuffer)
}

// ---------------------------------------------------------------------------
// Word – proper .docx with docx
// ---------------------------------------------------------------------------
export async function exportToWord(data: ExportData): Promise<Buffer> {
  const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    HeadingLevel,
    Table,
    TableRow,
    TableCell,
    WidthType,
    AlignmentType,
  } = await import("docx")

  const children: any[] = []

  // Title
  children.push(
    new Paragraph({
      text: data.title,
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    })
  )

  // Type + metadata
  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Type: ", bold: true, size: 22 }),
        new TextRun({ text: data.type.replace(/_/g, " "), size: 22 }),
      ],
      spacing: { after: 100 },
    })
  )

  if (data.metadata?.subject) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Subject: ", bold: true, size: 22 }),
          new TextRun({ text: data.metadata.subject, size: 22 }),
        ],
        spacing: { after: 100 },
      })
    )
  }

  if (data.metadata?.gradeLevel) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Grade: ", bold: true, size: 22 }),
          new TextRun({ text: data.metadata.gradeLevel, size: 22 }),
        ],
        spacing: { after: 200 },
      })
    )
  }

  children.push(new Paragraph({ spacing: { after: 200 } }))

  // Content table
  const rows = flattenContent(data.content)

  if (rows.length > 0) {
    const headerCells = ["#", "Section / Question", "Details", "Marks"].map(
      (h) =>
        new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text: h, bold: true, size: 20 })],
              alignment: AlignmentType.CENTER,
            }),
          ],
          shading: { fill: "4F46E5", type: "clear" },
          width: { size: h === "Marks" ? 10 : 30, type: WidthType.PERCENTAGE },
        })
    )

    const tableRows = [
      new TableRow({ children: headerCells }),
      ...rows.map(
        (r) =>
          new TableRow({
            children: r.map(
              (cell: string) =>
                new TableCell({
                  children: [
                    new Paragraph({ children: [new TextRun(cell ?? "")] }),
                  ],
                })
            ),
          })
      ),
    ]

    children.push(
      new Table({
        rows: tableRows,
        width: { size: 100, type: WidthType.PERCENTAGE },
      })
    )
  }

  const doc = new Document({
    creator: "AI Lesson Planner",
    title: data.title,
    sections: [{ children }],
  })

  return await Packer.toBuffer(doc)
}

// ---------------------------------------------------------------------------
// PowerPoint – slides with pptxgenjs
// ---------------------------------------------------------------------------
export async function exportToPowerPoint(data: ExportData): Promise<Buffer> {
  const PptxGenJS = (await import("pptxgenjs")).default
  const pres = new PptxGenJS()
  pres.author = "AI Lesson Planner"
  pres.title = data.title

  // Title slide
  const titleSlide = pres.addSlide()
  titleSlide.background = { fill: "4F46E5" }
  titleSlide.addText(data.title, {
    x: 1,
    y: 1.5,
    w: 8,
    h: 2,
    fontSize: 28,
    color: "FFFFFF",
    bold: true,
    align: "center",
  })
  titleSlide.addText(`Type: ${data.type.replace(/_/g, " ")}`, {
    x: 1,
    y: 3.5,
    w: 8,
    h: 1,
    fontSize: 16,
    color: "E0E0E0",
    align: "center",
  })

  // Content slide
  const contentSlide = pres.addSlide()
  contentSlide.addText(data.title, {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.7,
    fontSize: 20,
    bold: true,
    color: "4F46E5",
  })

  const rows = flattenContent(data.content)

  if (rows.length > 0) {
    const tableHeader = [["#", "Section / Question", "Details", "Marks"]]
    const tableBody = rows.map((r) => r.map((c: string) => c ?? ""))

    contentSlide.addTable([...tableHeader, ...tableBody] as any, {
      x: 0.5,
      y: 1.2,
      w: 9,
      fontSize: 11,
      colW: [0.5, 3, 4, 1.5],
      border: { type: "solid", color: "CCCCCC", pt: 0.5 },
      rowH: [0.5],
      autoPage: true,
    })
  } else {
    const text =
      typeof data.content === "string"
        ? data.content
        : JSON.stringify(data.content, null, 2)
    contentSlide.addText(text, {
      x: 0.5,
      y: 1.2,
      w: 9,
      h: 5,
      fontSize: 12,
      valign: "top",
    })
  }

  const buf: any = await pres.write({ outputType: "nodebuffer" })
  return Buffer.from(buf as ArrayBuffer)
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Convert a content value (object / array / string) into rows suitable for
 *  a table export.  Each row is an array of 4 cells:
 *  [index, section/question, details, marks]
 */
function flattenContent(content: any): string[][] {
  const rows: string[][] = []

  if (typeof content === "string") {
    rows.push(["1", "Content", content, ""])
    return rows
  }

  const items = Array.isArray(content) ? content : [content]

  for (const item of items) {
    if (typeof item === "string") {
      rows.push([String(rows.length + 1), "", item, ""])
    } else if (item.questions && Array.isArray(item.questions)) {
      // Worksheet / exam content with questions array
      rows.push([
        String(rows.length + 1),
        item.title ?? "",
        item.instructions ?? "",
        "",
      ])
      for (const q of item.questions) {
        rows.push([
          "",
          q.question ?? "",
          q.type ?? "",
          String(q.marks ?? ""),
        ])
      }
    } else if (item.sections && Array.isArray(item.sections)) {
      // Exam content with sections
      for (const section of item.sections) {
        rows.push([
          String(rows.length + 1),
          section.name ?? section.title ?? "",
          section.instructions ?? "",
          String(section.totalMarks ?? ""),
        ])
        if (section.questions) {
          for (const q of section.questions) {
            rows.push([
              "",
              `Q${q.number ?? ""}`,
              q.question ?? "",
              String(q.marks ?? ""),
            ])
          }
        }
      }
    } else if (item.weeks && Array.isArray(item.weeks)) {
      // Scheme of work content
      for (const week of item.weeks) {
        rows.push([
          `Week ${week.week ?? ""}`,
          week.strand ?? "",
          week.subStrand ?? "",
          "",
        ])
        if (week.learningOutcomes) {
          rows.push(["", "Learning Outcomes", week.learningOutcomes.join("; "), ""])
        }
        if (week.learningExperiences) {
          rows.push(["", "Learning Experiences", week.learningExperiences.join("; "), ""])
        }
        if (week.assessment) {
          rows.push(["", "Assessment", week.assessment.join("; "), ""])
        }
      }
    } else {
      // Generic object – show keys/values as rows
      for (const [key, val] of Object.entries(item)) {
        rows.push([
          String(rows.length + 1),
          key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()),
          typeof val === "string"
            ? val
            : Array.isArray(val)
              ? val.join("; ")
              : JSON.stringify(val),
          "",
        ])
      }
    }
  }

  return rows
}

/** Build a standalone HTML page for the content (used by PDF export &
 *  keep as fallback). */
function buildHtmlDocument(data: ExportData): string {
  const content =
    typeof data.content === "string"
      ? data.content
      : JSON.stringify(data.content, null, 2)

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(data.title)}</title>
  <style>
    @page { margin: 20mm; }
    body { font-family: 'Inter', 'Segoe UI', sans-serif; padding: 2em; line-height: 1.6; color: #1a1a1a; max-width: 900px; margin: 0 auto; }
    h1 { font-size: 1.75em; margin-bottom: 0.25em; border-bottom: 2px solid #4F46E5; padding-bottom: 0.25em; }
    .meta { color: #666; font-size: 0.9em; margin-bottom: 2em; }
    pre { white-space: pre-wrap; font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 0.85em; background: #f5f5f5; padding: 1em; border-radius: 6px; }
    table { width: 100%; border-collapse: collapse; margin: 1em 0; }
    th, td { border: 1px solid #ddd; padding: 0.5em; text-align: left; font-size: 0.9em; }
    th { background: #4F46E5; color: #fff; font-weight: 600; }
    tr:nth-child(even) { background: #f9f9f9; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <h1>${escapeHtml(data.title)}</h1>
  <p class="meta">Type: ${escapeHtml(data.type.replace(/_/g, " "))}</p>
  <pre>${escapeHtml(content)}</pre>
</body>
</html>`
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

// ---------------------------------------------------------------------------
// Database helpers
// ---------------------------------------------------------------------------

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
