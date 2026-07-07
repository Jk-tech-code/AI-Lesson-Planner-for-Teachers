import { WorksheetGenerator } from "@/components/generators/worksheet-generator"

export const metadata = {
  title: "Worksheets",
}

export default function WorksheetsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Worksheets</h1>
        <p className="text-muted-foreground mt-1">
          Generate printable CBC worksheets for your students
        </p>
      </div>
      <WorksheetGenerator />
    </div>
  )
}
