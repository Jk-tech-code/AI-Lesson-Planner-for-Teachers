import { Providers } from "@/components/providers"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <div className="flex min-h-screen">
        {children}
      </div>
    </Providers>
  )
}
