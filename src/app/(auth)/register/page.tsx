import type { Metadata } from "next"
import { RegisterForm } from "@/components/auth/register-form"
import { Sparkles } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your AI Lesson Planner account and start generating CBC teaching resources in seconds.",
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl mb-2">
            <Sparkles className="h-8 w-8 text-blue-600" />
            AI Lesson Planner
          </Link>
          <h1 className="text-2xl font-bold mt-6">Create your account</h1>
          <p className="text-muted-foreground mt-2">Start generating lessons with AI</p>
        </div>
        <RegisterForm />
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
