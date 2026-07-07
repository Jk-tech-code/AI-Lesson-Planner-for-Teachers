import { LessonPlanGenerator } from "@/components/generators/lesson-plan-generator"

export const metadata = {
  title: "Generate Lesson Plan",
}

export default function LessonsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lesson Plans</h1>
        <p className="text-muted-foreground mt-1">
          Generate comprehensive CBC lesson plans with AI
        </p>
      </div>
      <LessonPlanGenerator />
    </div>
  )
}
