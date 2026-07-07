export const CURRENCIES = {
  KES: { symbol: "KSh", code: "KES", locale: "en-KE" },
  USD: { symbol: "$", code: "USD", locale: "en-US" },
} as const

export const APP_INFO = {
  name: "AI Lesson Planner",
  tagline: "Generate professional CBC teaching documents with AI",
  description:
    "AI-powered lesson planning platform for teachers. Generate schemes of work, lesson plans, assessments, and more.",
} as const

export const GENERATION_LIMITS = {
  FREE: {
    documentsPerMonth: 5,
    storageMB: 100,
    maxExports: 1,
  },
  PROFESSIONAL: {
    documentsPerMonth: -1,
    storageMB: 1024,
    maxExports: -1,
  },
  SCHOOL: {
    documentsPerMonth: -1,
    storageMB: 5120,
    maxExports: -1,
    maxTeachers: 10,
  },
  ENTERPRISE: {
    documentsPerMonth: -1,
    storageMB: -1,
    maxExports: -1,
    maxTeachers: -1,
  },
} as const

export const CBC_GRADES = [
  "PP1",
  "PP2",
  "GRADE_1",
  "GRADE_2",
  "GRADE_3",
  "GRADE_4",
  "GRADE_5",
  "GRADE_6",
  "GRADE_7",
  "GRADE_8",
  "GRADE_9",
] as const

export const CURRICULUM_OPTIONS = [
  { value: "CBC", label: "Kenya CBC" },
  { value: "CAMBRIDGE", label: "Cambridge" },
  { value: "IB", label: "International Baccalaureate" },
  { value: "IGCSE", label: "IGCSE" },
  { value: "AMERICAN", label: "American Curriculum" },
] as const

export const EXAM_TYPES = [
  { value: "CAT", label: "Continuous Assessment Test" },
  { value: "MIDTERM", label: "Mid Term Exam" },
  { value: "END_TERM", label: "End Term Exam" },
  { value: "ANNUAL", label: "Annual Exam" },
] as const

export const ASSESSMENT_TYPES = [
  { value: "RUBRIC", label: "Rubric" },
  { value: "OBSERVATION_CHECKLIST", label: "Observation Checklist" },
  { value: "SELF_ASSESSMENT", label: "Self Assessment" },
  { value: "PEER_ASSESSMENT", label: "Peer Assessment" },
  { value: "PORTFOLIO", label: "Portfolio Assessment" },
] as const

export const QUESTION_TYPES = [
  { value: "MCQ", label: "Multiple Choice" },
  { value: "STRUCTURED", label: "Structured" },
  { value: "ESSAY", label: "Essay" },
  { value: "PRACTICAL", label: "Practical" },
  { value: "TRUE_FALSE", label: "True/False" },
  { value: "FILL_BLANKS", label: "Fill in the Blanks" },
  { value: "MATCHING", label: "Matching" },
] as const

export const EXPORT_FORMATS = [
  { value: "pdf", label: "PDF", icon: "File" },
  { value: "word", label: "Word", icon: "FileText" },
  { value: "powerpoint", label: "PowerPoint", icon: "Presentation" },
  { value: "excel", label: "Excel", icon: "FileSpreadsheet" },
  { value: "google-docs", label: "Google Docs", icon: "File" },
] as const

export const SIDEBAR_WIDTH = 280
export const SIDEBAR_COLLAPSED_WIDTH = 72

export const PAGINATION = {
  defaultPageSize: 20,
  maxPageSize: 100,
} as const
