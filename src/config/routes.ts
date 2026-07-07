export const publicRoutes = ["/", "/login", "/register", "/forgot-password"]

export const authRoutes = ["/login", "/register"]

export const apiAuthPrefix = "/api/auth"

export const DEFAULT_LOGIN_REDIRECT = "/dashboard"

export const sidebarLinks = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
  },
  {
    label: "Scheme of Work",
    href: "/schemes",
    icon: "CalendarCheck",
  },
  {
    label: "Lesson Plans",
    href: "/lessons",
    icon: "BookOpen",
  },
  {
    label: "Lesson Notes",
    href: "/notes",
    icon: "FileText",
  },
  {
    label: "Worksheets",
    href: "/worksheets",
    icon: "FileSpreadsheet",
  },
  {
    label: "Homework",
    href: "/homework",
    icon: "Pencil",
  },
  {
    label: "Assessments",
    href: "/assessments",
    icon: "ClipboardCheck",
  },
  {
    label: "Exams",
    href: "/exams",
    icon: "GraduationCap",
  },
  {
    label: "Marking Schemes",
    href: "/marking-schemes",
    icon: "CheckSquare",
  },
  {
    label: "Documents",
    href: "/documents",
    icon: "FolderOpen",
  },
  {
    label: "AI Chat",
    href: "/chat",
    icon: "MessageSquare",
  },
] as const

export const adminLinks = [
  {
    label: "Overview",
    href: "/admin",
    icon: "LayoutDashboard",
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: "Users",
  },
  {
    label: "Schools",
    href: "/admin/schools",
    icon: "Building2",
  },
  {
    label: "Subscriptions",
    href: "/admin/subscriptions",
    icon: "CreditCard",
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: "BarChart3",
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: "Settings",
  },
] as const
