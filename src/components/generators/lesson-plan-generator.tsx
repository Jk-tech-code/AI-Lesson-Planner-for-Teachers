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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Sparkles } from "lucide-react"
import { toast } from "sonner"

const formSchema = z.object({
  gradeLevel: z.string().min(1, "Grade level is required"),
  subject: z.string().min(1, "Subject is required"),
  term: z.string().min(1, "Term is required"),
  week: z.string().min(1, "Week is required"),
  strand: z.string().min(1, "Strand is required"),
  subStrand: z.string().min(1, "Sub-strand is required"),
  topic: z.string().min(1, "Topic is required"),
})

const grades = [
  "PP1", "PP2", "Grade 1", "Grade 2", "Grade 3",
  "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9",
]

const subjects = [
  "Mathematics", "English", "Kiswahili", "Science and Technology",
  "Social Studies", "CRE", "IRE", "Hindu", "Physical Education",
  "Music", "Art and Craft", "Home Science", "Agriculture",
  "Indigenous Languages", "Kenyan Sign Language",
]

const terms = ["Term 1", "Term 2", "Term 3"]

export function LessonPlanGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gradeLevel: "",
      subject: "",
      term: "",
      week: "",
      strand: "",
      subStrand: "",
      topic: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true)
    setGeneratedContent(null)

    try {
      const res = await fetch("/api/generate/lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Generation failed")
      }

      const data = await res.json()

      if (data.data?.content) {
        const content = typeof data.data.content === "string"
          ? data.data.content
          : JSON.stringify(data.data.content, null, 2)
        setGeneratedContent(content)
        toast.success("Lesson plan generated successfully!")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to generate lesson plan")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Lesson Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        {grades.map((grade) => (
                          <SelectItem key={grade} value={grade}>
                            {grade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="term"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Term</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select term" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {terms.map((term) => (
                            <SelectItem key={term} value={term}>
                              {term}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="week"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Week</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Week 3" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="strand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Strand</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Numbers" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subStrand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sub-strand</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Whole Numbers" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Addition of Whole Numbers" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Lesson Plan
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generated Output</CardTitle>
        </CardHeader>
        <CardContent>
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-4" />
              <p>Generating your lesson plan...</p>
            </div>
          ) : generatedContent ? (
            <pre className="whitespace-pre-wrap text-sm font-mono bg-muted p-4 rounded-lg max-h-[600px] overflow-y-auto">
              {generatedContent}
            </pre>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Sparkles className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-center">
                Fill in the lesson details and click generate to create your lesson plan.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
