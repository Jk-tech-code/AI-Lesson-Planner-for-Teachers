"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Sparkles } from "lucide-react"
import { toast } from "sonner"

const formSchema = z.object({
  gradeLevel: z.string().min(1),
  subject: z.string().min(1),
  examType: z.string().min(1),
  topic: z.string().min(1),
  totalMarks: z.string().min(1),
  duration: z.string().min(1),
  questionTypes: z.array(z.string()).min(1, "Select at least one question type"),
})

const grades = ["Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9"]
const subjects = ["Mathematics", "English", "Kiswahili", "Science", "Social Studies", "CRE", "IRE"]
const examTypes = [
  { value: "CAT", label: "Continuous Assessment Test" },
  { value: "MIDTERM", label: "Mid Term" },
  { value: "END_TERM", label: "End Term" },
  { value: "ANNUAL", label: "Annual" },
]
const questionTypeOptions = [
  { id: "MCQ", label: "Multiple Choice" },
  { id: "STRUCTURED", label: "Structured" },
  { id: "ESSAY", label: "Essay" },
  { id: "PRACTICAL", label: "Practical" },
  { id: "TRUE_FALSE", label: "True/False" },
  { id: "FILL_BLANKS", label: "Fill in the Blanks" },
  { id: "MATCHING", label: "Matching" },
]

export function ExamGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gradeLevel: "",
      subject: "",
      examType: "",
      topic: "",
      totalMarks: "50",
      duration: "60",
      questionTypes: [],
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true)
    setGeneratedContent(null)

    try {
      const res = await fetch("/api/generate/exam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Generation failed")
      }

      const data = await res.json()
      const content = typeof data.data.content === "string"
        ? data.data.content
        : JSON.stringify(data.data.content, null, 2)
      setGeneratedContent(content)
      toast.success("Exam generated successfully!")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to generate exam")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Exam Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="gradeLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grade Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select grade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {grades.map((g) => (
                            <SelectItem key={g} value={g}>{g}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="examType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exam Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {examTypes.map((t) => (
                            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subjects.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic / Coverage</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the topics to cover in this exam"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="totalMarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Marks</FormLabel>
                      <FormControl>
                        <Input type="number" min={10} max={100} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input type="number" min={15} max={180} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="questionTypes"
                render={() => (
                  <FormItem>
                    <FormLabel>Question Types</FormLabel>
                    <div className="grid grid-cols-2 gap-2">
                      {questionTypeOptions.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="questionTypes"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-2 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    const current = field.value || []
                                    if (checked) {
                                      field.onChange([...current, item.id])
                                    } else {
                                      field.onChange(current.filter((v) => v !== item.id))
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal cursor-pointer">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isGenerating}>
                {isGenerating ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Exam...</>
                ) : (
                  <><Sparkles className="mr-2 h-4 w-4" /> Generate Exam</>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Generated Exam</CardTitle>
        </CardHeader>
        <CardContent>
          {isGenerating ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mr-4" />
              <p>Generating exam...</p>
            </div>
          ) : generatedContent ? (
            <pre className="whitespace-pre-wrap text-sm font-mono bg-muted p-4 rounded-lg max-h-[600px] overflow-y-auto">
              {generatedContent}
            </pre>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Sparkles className="h-12 w-12 mb-4 opacity-50" />
              <p>Fill in the details to generate an exam.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
