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
  Building2,
  Users,
  CreditCard,
  BarChart3,
  Settings,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export const siteConfig = {
  name: "AI Lesson Planner",
  description: "Generate professional CBC teaching documents with AI",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "/images/og.png",
  links: {
    twitter: "https://twitter.com/ailessonplanner",
    github: "https://github.com/ailessonplanner",
  },
}

export const supportedGrades = [
  "PP1",
  "PP2",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
] as const

export type SubscriptionTier = "FREE" | "PROFESSIONAL" | "SCHOOL" | "ENTERPRISE"

export interface SubscriptionPlan {
  id: SubscriptionTier
  name: string
  description: string
  monthlyPrice: number
  yearlyPrice: number
  stripeMonthlyPriceId?: string
  stripeYearlyPriceId?: string
  features: string[]
  highlighted?: boolean
  popular?: boolean
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "FREE",
    name: "Free",
    description: "Get started with basic lesson planning tools.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    stripeMonthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_FREE_PRICE_ID,
    stripeYearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_FREE_YEARLY_PRICE_ID,
    features: [
      "5 documents per month",
      "Basic templates",
      "PDF export",
      "Community support",
    ],
  },
  {
    id: "PROFESSIONAL",
    name: "Professional",
    description: "Perfect for individual teachers who need more.",
    monthlyPrice: 15,
    yearlyPrice: 150,
    stripeMonthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PROFESSIONAL_PRICE_ID,
    stripeYearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PROFESSIONAL_YEARLY_PRICE_ID,
    features: [
      "Unlimited documents",
      "All templates",
      "All export formats (PDF, Word, PPT, Excel)",
      "AI chat assistant",
      "Priority support",
      "Version history",
    ],
    popular: true,
  },
  {
    id: "SCHOOL",
    name: "School",
    description: "For schools and departments.",
    monthlyPrice: 50,
    yearlyPrice: 500,
    stripeMonthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_SCHOOL_PRICE_ID,
    stripeYearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_SCHOOL_YEARLY_PRICE_ID,
    features: [
      "Up to 10 teachers",
      "All Professional features",
      "School branding",
      "Admin dashboard",
      "Team management",
      "Shared templates",
      "API access",
    ],
  },
  {
    id: "ENTERPRISE",
    name: "Enterprise",
    description: "For large institutions and organizations.",
    monthlyPrice: 200,
    yearlyPrice: 2000,
    stripeMonthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID,
    stripeYearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_YEARLY_PRICE_ID,
    features: [
      "Unlimited teachers",
      "All School features",
      "Custom integrations",
      "Dedicated support",
      "Custom branding",
      "On-premise option",
      "SLA guarantee",
      "Custom AI models",
    ],
    highlighted: true,
  },
]
