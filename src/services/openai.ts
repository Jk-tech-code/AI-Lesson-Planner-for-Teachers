import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface GenerateOptions {
  prompt: string
  systemPrompt?: string
  model?: string
  temperature?: number
  maxTokens?: number
  stream?: boolean
  format?: "json" | "text"
}

const DEFAULT_SYSTEM_PROMPT = `You are an expert Kenyan CBC curriculum specialist and teacher. 
You create professional, accurate, and pedagogically sound teaching documents.
Always use proper educational terminology and follow CBC guidelines.
Respond in clear, professional English.`

export async function generateContent(options: GenerateOptions) {
  const {
    prompt,
    systemPrompt = DEFAULT_SYSTEM_PROMPT,
    model = "gpt-4o-mini",
    temperature = 0.7,
    maxTokens = 4000,
    format = "text",
  } = options

  const completion = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
    temperature,
    max_tokens: maxTokens,
    response_format: format === "json" ? { type: "json_object" } : undefined,
  })

  return completion.choices[0]?.message?.content || ""
}

export async function generateStreamingContent(
  options: GenerateOptions,
  onChunk: (chunk: string) => void
) {
  const {
    prompt,
    systemPrompt = DEFAULT_SYSTEM_PROMPT,
    model = "gpt-4o-mini",
    temperature = 0.7,
    maxTokens = 4000,
  } = options

  const stream = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
    temperature,
    max_tokens: maxTokens,
    stream: true,
  })

  let fullContent = ""
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || ""
    fullContent += content
    onChunk(content)
  }

  return fullContent
}

export const LESSON_PLAN_PROMPT = `Generate a comprehensive CBC lesson plan in JSON format with the following structure:
{
  "title": "Lesson title",
  "gradeLevel": "Grade level",
  "subject": "Subject name",
  "strand": "Strand name",
  "subStrand": "Sub-strand name",
  "topic": "Specific topic",
  "duration": "Lesson duration in minutes",
  "objectives": {
    "knowledge": "Knowledge objective",
    "skills": "Skills objective",
    "attitudes": "Attitude objective"
  },
  "coreCompetencies": ["List of CBC core competencies"],
  "values": ["List of values"],
  "pcis": ["Pertinent and Contemporary Issues"],
  "lessonIntroduction": "Introduction activity",
  "teacherActivities": ["Step-by-step teacher activities"],
  "learnerActivities": ["Corresponding learner activities"],
  "assessment": ["Assessment methods"],
  "homework": "Homework assignment",
  "reflection": "Teacher reflection notes",
  "materials": ["Required materials"],
  "references": ["References"]
}`

export const SCHEME_PROMPT = `Generate a comprehensive CBC scheme of work in JSON format with the following structure:
{
  "subject": "Subject name",
  "gradeLevel": "Grade level",
  "term": "Term",
  "year": "Year",
  "weeks": [
    {
      "week": 1,
      "strand": "Strand name",
      "subStrand": "Sub-strand name",
      "learningOutcomes": ["Learning outcomes"],
      "learningExperiences": ["Learning experiences"],
      "resources": ["Resources needed"],
      "assessment": ["Assessment methods"],
      "reflection": "Reflection notes"
    }
  ]
}`

export const EXAM_PROMPT = `Generate a professional CBC exam in JSON format with the following structure:
{
  "title": "Exam title",
  "gradeLevel": "Grade level",
  "subject": "Subject",
  "examType": "CAT | MIDTERM | END_TERM | ANNUAL",
  "duration": "Duration in minutes",
  "totalMarks": "Total marks",
  "instructions": "General instructions",
  "sections": [
    {
      "name": "Section A",
      "instructions": "Section instructions",
      "totalMarks": "Section marks",
      "questions": [
        {
          "number": 1,
          "type": "MCQ | STRUCTURED | ESSAY | PRACTICAL",
          "question": "Question text",
          "marks": 2,
          "options": ["Option A", "Option B", "Option C", "Option D"]
        }
      ]
    }
  ]
}`
