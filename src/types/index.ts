import type { User } from "@prisma/client"

export type SafeUser = Omit<User, "passwordHash"> & {
  passwordHash?: never
}

export interface GenerateLessonInput {
  gradeLevel: string
  subject: string
  term: string
  week: string
  strand: string
  subStrand: string
  topic: string
}

export interface GenerateSchemeInput {
  gradeLevel: string
  subject: string
  term: string
  weekCount: number
  strand: string
  subStrand: string
}

export interface GenerateExamInput {
  gradeLevel: string
  subject: string
  examType: string
  questionTypes: string[]
  totalMarks: number
  duration: number
}

export interface GenerateAssessmentInput {
  gradeLevel: string
  subject: string
  assessmentType: string
  topic: string
}

export interface LessonPlanContent {
  objectives: {
    knowledge: string
    skills: string
    attitudes: string
  }
  coreCompetencies: string[]
  values: string[]
  pcis: string[]
  teacherActivities: string[]
  learnerActivities: string[]
  assessment: string[]
  homework: string
  reflection: string
  materials: string[]
  references: string[]
}

export interface SchemeOfWorkEntry {
  week: number
  strand: string
  subStrand: string
  learningOutcomes: string[]
  learningExperiences: string[]
  resources: string[]
  assessment: string[]
  reflection: string
}

export interface WorksheetContent {
  title: string
  instructions: string
  questions: {
    type: "mcq" | "fill_blanks" | "true_false" | "matching" | "practical" | "project"
    question: string
    options?: string[]
    answer?: string
    marks?: number
  }[]
}

export interface ExamContent {
  instructions: string
  sections: {
    name: string
    instructions: string
    totalMarks: number
    questions: {
      number: number
      type: string
      question: string
      marks: number
      options?: string[]
    }[]
  }[]
}

export interface MarkingSchemeContent {
  examTitle: string
  instructions: string
  answers: {
    questionNumber: number
    answer: string
    marks: number
    rubric?: string[]
  }[]
  teacherNotes: string[]
}

export interface AssessmentContent {
  type: string
  criteria: {
    name: string
    description: string
    levels: {
      name: string
      description: string
      score: number
    }[]
  }[]
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  createdAt: Date
}

export interface DocumentSearchParams {
  query?: string
  type?: string
  subject?: string
  gradeLevel?: string
  folderId?: string
  page?: number
  limit?: number
}

export interface SubscriptionLimits {
  documents: number
  storage: number
  exports: string
  ai: string
  teachers?: number
}
