"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  CalendarCheck,
  BookOpen,
  FileText,
  FileSpreadsheet,
  Pencil,
  ClipboardCheck,
  GraduationCap,
  CheckSquare,
  FolderOpen,
  MessageSquare,
  Settings,
  Building2,
  Sparkles,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const sidebarLinks = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Scheme of Work", href: "/schemes", icon: CalendarCheck },
  { label: "Lesson Plans", href: "/lessons", icon: BookOpen },
  { label: "Lesson Notes", href: "/notes", icon: FileText },
  { label: "Worksheets", href: "/worksheets", icon: FileSpreadsheet },
  { label: "Homework", href: "/homework", icon: Pencil },
  { label: "Assessments", href: "/assessments", icon: ClipboardCheck },
  { label: "Exams", href: "/exams", icon: GraduationCap },
  { label: "Marking Schemes", href: "/marking-schemes", icon: CheckSquare },
  { label: "Documents", href: "/documents", icon: FolderOpen },
  { label: "AI Chat", href: "/chat", icon: MessageSquare },
]

const bottomLinks = [
  { label: "School", href: "/school", icon: Building2 },
  { label: "Settings", href: "/settings", icon: Settings },
]

interface SidebarContentProps {
  onNavClick?: () => void
}

function SidebarContent({ onNavClick }: SidebarContentProps) {
  const pathname = usePathname()

  return (
    <>
      <div className="flex h-14 items-center gap-2 border-b px-6 font-semibold">
        <Sparkles className="h-5 w-5 text-primary" />
        <span className="text-sm">AI Lesson Planner</span>
      </div>
      <ScrollArea className="flex-1 py-2">
        <nav className="space-y-1 px-3">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavClick}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                pathname === link.href || pathname.startsWith(link.href + "/")
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <link.icon className="h-4 w-4 shrink-0" />
              {link.label}
            </Link>
          ))}
        </nav>
        <Separator className="my-4 mx-3" />
        <nav className="space-y-1 px-3">
          {bottomLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavClick}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                pathname === link.href || pathname.startsWith(link.href + "/")
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <link.icon className="h-4 w-4 shrink-0" />
              {link.label}
            </Link>
          ))}
        </nav>
      </ScrollArea>
    </>
  )
}

export function DashboardSidebar() {
  return (
    <aside className="hidden lg:flex w-64 flex-col border-r bg-sidebar h-screen sticky top-0 shrink-0">
      <SidebarContent />
    </aside>
  )
}

export function MobileSidebar({ onNavClick }: { onNavClick: () => void }) {
  return (
    <aside className="flex flex-col h-full bg-sidebar">
      <SidebarContent onNavClick={onNavClick} />
    </aside>
  )
}
