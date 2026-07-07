"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  BookOpen,
  CalendarCheck,
  ClipboardCheck,
  FileText,
  Plus,
  ArrowRight,
  Sparkles,
  GraduationCap,
  FileSpreadsheet,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import type { Document } from "@prisma/client"

interface DashboardClientProps {
  userName: string
  stats: {
    documents: number
    schemes: number
    lessons: number
    assessments: number
  }
  recentDocuments: Document[]
  subscriptionTier: string
}

const quickActions = [
  {
    title: "Scheme of Work",
    description: "Generate a termly scheme of work",
    href: "/schemes",
    icon: CalendarCheck,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950",
  },
  {
    title: "Lesson Plan",
    description: "Create a detailed lesson plan",
    href: "/lessons",
    icon: BookOpen,
    color: "text-green-600",
    bg: "bg-green-50 dark:bg-green-950",
  },
  {
    title: "Exam",
    description: "Generate an exam paper",
    href: "/exams",
    icon: GraduationCap,
    color: "text-purple-600",
    bg: "bg-purple-50 dark:bg-purple-950",
  },
  {
    title: "Worksheet",
    description: "Create a practice worksheet",
    href: "/worksheets",
    icon: FileSpreadsheet,
    color: "text-orange-600",
    bg: "bg-orange-50 dark:bg-orange-950",
  },
]

const generatorCards = [
  { title: "Lesson Plans", count: 0, href: "/lessons", icon: BookOpen, color: "text-blue-600" },
  { title: "Schemes of Work", count: 0, href: "/schemes", icon: CalendarCheck, color: "text-green-600" },
  { title: "Lesson Notes", count: 0, href: "/notes", icon: FileText, color: "text-yellow-600" },
  { title: "Worksheets", count: 0, href: "/worksheets", icon: FileSpreadsheet, color: "text-orange-600" },
  { title: "Assessments", count: 0, href: "/assessments", icon: ClipboardCheck, color: "text-purple-600" },
  { title: "Exams", count: 0, href: "/exams", icon: GraduationCap, color: "text-red-600" },
]

export function DashboardClient({
  userName,
  stats,
  recentDocuments,
  subscriptionTier,
}: DashboardClientProps) {
  const router = useRouter()
  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {userName}
        </h1>
        <p className="text-muted-foreground mt-1">
          {subscriptionTier === "FREE"
            ? "You're on the Free plan. Upgrade to unlock unlimited documents."
            : `You're on the ${subscriptionTier} plan.`}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.documents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Schemes of Work</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.schemes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Lesson Plans</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.lessons}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Assessments</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.assessments}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Generate</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Card className="group cursor-pointer border-2 hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                  <div className={`inline-flex p-3 rounded-lg ${action.bg} ${action.color} mb-4`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold mb-1">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Documents */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Documents</CardTitle>
            <CardDescription>Your recently generated documents</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => router.push("/documents")}>
            View all <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {recentDocuments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No documents yet. Start by generating your first lesson plan!</p>
              <Button className="mt-4" onClick={() => router.push("/lessons")}>
                <Plus className="mr-2 h-4 w-4" />
                Generate Lesson Plan
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentDocuments.map((doc) => (
                <Link
                  key={doc.id}
                  href={`/documents/${doc.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{doc.title}</p>
                      <p className="text-xs text-muted-foreground">{doc.type.replace(/_/g, " ")}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatDate(doc.createdAt)}</span>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
