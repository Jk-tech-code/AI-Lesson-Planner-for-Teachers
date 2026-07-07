import Link from "next/link"
import { ArrowRight, BookOpen, Sparkles, Layers, Download, MessageSquare, GraduationCap } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { PricingSection } from "@/components/subscription/pricing-section"

const features = [
  {
    icon: BookOpen,
    title: "Lesson Plans",
    description: "Generate complete CBC lesson plans with objectives, activities, and assessments",
  },
  {
    icon: Layers,
    title: "Scheme of Work",
    description: "Create termly schemes of work aligned to the CBC curriculum",
  },
  {
    icon: GraduationCap,
    title: "Exams & Assessments",
    description: "Generate exams, rubrics, and various assessment tools",
  },
  {
    icon: Download,
    title: "Multiple Exports",
    description: "Export to PDF, Word, PowerPoint, Excel, and Google Docs",
  },
  {
    icon: MessageSquare,
    title: "AI Assistant",
    description: "Chat with AI for instant teaching resources and answers",
  },
  {
    icon: Sparkles,
    title: "Smart Generation",
    description: "AI-powered document generation tailored to your curriculum",
  },
]

const stats = [
  { value: "50,000+", label: "Documents Generated" },
  { value: "10,000+", label: "Active Teachers" },
  { value: "1,000+", label: "Schools" },
  { value: "99.9%", label: "Uptime" },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Sparkles className="h-6 w-6 text-primary" />
            AI Lesson Planner
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Login
            </Link>
            <Link
              href="/register"
              className={cn(buttonVariants({ variant: "default" }))}
            >
              Get Started Free
            </Link>
          </nav>
        </div>
      </header>

      <section className="container mx-auto px-4 py-24 text-center">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Plan Lessons with{" "}
            <span className="bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
              AI Power
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Generate professional CBC teaching documents in seconds. Save hours every week with AI-powered lesson planning.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className={cn(buttonVariants({ size: "lg" }))}
            >
              Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="#features"
              className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
            >
              See Features
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tools for modern teachers. From lesson planning to assessment generation.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <feature.icon className="h-10 w-10 text-primary mb-2" />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <PricingSection />

      <section className="bg-gradient-to-r from-violet-600/90 to-indigo-600/90 text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Teaching?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of teachers using AI Lesson Planner.
          </p>
          <Link
            href="/register"
            className={cn(buttonVariants({ size: "lg", variant: "secondary" }))}
          >
            Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 font-bold text-lg mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Lesson Planner
              </div>
              <p className="text-sm text-muted-foreground">
                Generate professional CBC teaching documents with AI.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-3">Product</h3>
              <ul className="space-y-2">
                <li><Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sign In</Link></li>
                <li><Link href="/register" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Get Started</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-3">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
                <li><Link href="/refund-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Refund Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} AI Lesson Planner. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
