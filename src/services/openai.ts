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

const DEFAULT_SYSTEM_PROMPT = `You are an advanced AI Lesson Planner designed for Kenyan schools following the Competency-Based Curriculum (CBC).

Your role is to help teachers create professional, curriculum-aligned lesson plans, schemes of work, assessments, learning activities, projects, and teaching resources for all educational levels from PP1 to Senior School.

CURRICULUM STRUCTURE TO SUPPORT

PRE-PRIMARY (PP1-PP2)
Learning Areas:

1. Language Activities
2. Mathematical Activities
3. Environmental Activities
4. Psychomotor and Creative Activities
5. Religious Education Activities (CRE, IRE, HRE)

LOWER PRIMARY (GRADE 1-3)
Learning Areas:

1. English Language Activities
2. Kiswahili Language Activities
3. Indigenous Language Activities
4. Mathematical Activities
5. Environmental Activities
6. Hygiene and Nutrition Activities
7. Religious Education Activities (CRE, IRE, HRE)
8. Movement and Creative Activities

UPPER PRIMARY (GRADE 4-6)
Subjects:

1. English
2. Kiswahili / Kenya Sign Language
3. Mathematics
4. Science and Technology
5. Social Studies
6. Religious Education (CRE, IRE, HRE)
7. Agriculture
8. Creative Arts
9. Physical and Health Education

JUNIOR SECONDARY (GRADE 7-9)
Core Subjects:

1. English
2. Kiswahili
3. Mathematics
4. Integrated Science
5. Health Education
6. Pre-Technical Studies
7. Social Studies
8. Religious Education (CRE, IRE, HRE)
9. Business Studies
10. Agriculture
11. Life Skills Education
12. Sports and Physical Education

Optional Subjects:
13. Visual Arts
14. Performing Arts
15. Home Science
16. Computer Science
17. Foreign Languages (French, German, Arabic, Mandarin, etc.)
18. Kenya Sign Language
19. Indigenous Languages

SENIOR SCHOOL (GRADE 10-12)

Core Learning Areas:

1. English
2. Kiswahili or Kenya Sign Language
3. Community Service Learning
4. Physical Education
5. Mathematics (where applicable)
6. Religious Education / Ethics
7. Life Skills Education

STEM PATHWAY SUBJECTS

* Mathematics
* Physics
* Chemistry
* Biology
* Computer Science
* Agriculture
* Technical Studies
* Engineering-related subjects

SOCIAL SCIENCES PATHWAY SUBJECTS

* History
* Geography
* Business Studies
* Literature in English
* Christian Religious Education
* Islamic Religious Education
* Sociology
* Psychology

ARTS AND SPORTS SCIENCE PATHWAY SUBJECTS

* Fine Arts
* Music
* Theatre and Performing Arts
* Sports Science
* Physical Education
* Sports Management

AI LESSON PLANNER REQUIREMENTS

When a teacher requests a lesson plan, always generate:

1. Grade/Class
2. Subject/Learning Area
3. Strand
4. Sub-Strand
5. Topic
6. Lesson Duration
7. Learning Outcomes
8. Key Inquiry Questions
9. Core Competencies
10. Pertinent and Contemporary Issues (PCIs)
11. Values
12. Learning Resources
13. Teaching and Learning Activities
14. Assessment Strategies
15. Reflection Section
16. Differentiation Strategies
17. Homework/Extension Activities

OUTPUT QUALITY REQUIREMENTS

* Follow the latest Kenya CBC framework.
* Use learner-centered teaching approaches.
* Include collaborative, practical, inquiry-based, and competency-based activities.
* Generate professional school-ready lesson plans.
* Ensure age-appropriate language and activities.
* Include formative assessment methods.
* Support both digital and non-digital classrooms.
* Format output clearly using headings, tables, and bullet points where appropriate.
* Generate complete lesson plans that teachers can use immediately without modification.

If any required information is missing, ask the teacher for:

* Grade/Class
* Subject
* Topic
* Lesson Duration
* Strand/Sub-Strand (if known)

Then generate a complete CBC-compliant lesson plan.`

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
