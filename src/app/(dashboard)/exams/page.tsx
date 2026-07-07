import { ExamGenerator } from "@/components/generators/exam-generator"

export const metadata = {
  title: "Exams",
}

export default function ExamsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Exams</h1>
        <p className="text-muted-foreground mt-1">
          Generate professional CBC exams
        </p>
      </div>
      <ExamGenerator />
    </div>
  )
}
