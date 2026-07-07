"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { DashboardSidebar, MobileSidebar } from "@/components/layout/dashboard-sidebar"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <DashboardSidebar />

      {/* Main content area */}
      <div className="flex flex-1 flex-col">
        {/* Mobile header with menu toggle */}
        <div className="lg:hidden flex h-14 items-center gap-3 border-b bg-background px-4">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            }
          />
            <SheetContent side="left" className="p-0 w-64">
              <MobileSidebar onNavClick={() => setMobileMenuOpen(false)} />
            </SheetContent>
          </Sheet>
          <span className="font-semibold text-sm">AI Lesson Planner</span>
        </div>

        {/* Dashboard header */}
        <DashboardHeader />

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
