import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    schoolName: z.string().optional(),
    role: z.enum(["TEACHER", "SCHOOL_ADMIN"]).default("TEACHER"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export const generateLessonSchema = z.object({
  gradeLevel: z.string().min(1, "Grade level is required"),
  subject: z.string().min(1, "Subject is required"),
  term: z.string().min(1, "Term is required"),
  week: z.string().min(1, "Week is required"),
  strand: z.string().min(1, "Strand is required"),
  subStrand: z.string().min(1, "Sub-strand is required"),
  topic: z.string().min(1, "Topic is required"),
  duration: z.number().optional(),
})

export const generateSchemeSchema = z.object({
  gradeLevel: z.string().min(1),
  subject: z.string().min(1),
  term: z.string().min(1),
  weekCount: z.number().min(1).max(14),
  strand: z.string().min(1),
  subStrand: z.string().min(1),
})

export const generateExamSchema = z.object({
  gradeLevel: z.string().min(1),
  subject: z.string().min(1),
  examType: z.string().min(1),
  questionTypes: z.array(z.string()).min(1),
  totalMarks: z.number().min(1).max(100),
  duration: z.number().min(15).max(180),
})

export const generateAssessmentSchema = z.object({
  gradeLevel: z.string().min(1),
  subject: z.string().min(1),
  assessmentType: z.string().min(1),
  topic: z.string().min(1),
})

export const chatMessageSchema = z.object({
  message: z.string().min(1, "Message is required"),
  contextId: z.string().optional(),
})

export const documentSearchSchema = z.object({
  query: z.string().optional(),
  type: z.string().optional(),
  subject: z.string().optional(),
  gradeLevel: z.string().optional(),
  folderId: z.string().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(20),
})

export const schoolSchema = z.object({
  name: z.string().min(2, "School name is required"),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
  brandColor: z.string().optional(),
})

export const profileSchema = z.object({
  name: z.string().min(2),
  image: z.string().optional(),
})

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
