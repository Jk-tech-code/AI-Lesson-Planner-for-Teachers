import { SchemeGenerator } from "@/components/generators/scheme-generator"

export const metadata = {
  title: "Scheme of Work",
}

export default function SchemesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Scheme of Work</h1>
        <p className="text-muted-foreground mt-1">
          Generate termly schemes of work aligned to CBC
        </p>
      </div>
      <SchemeGenerator />
    </div>
  )
}
