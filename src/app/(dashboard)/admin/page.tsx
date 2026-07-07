import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { AdminClient } from "./admin-client"

export const metadata = {
  title: "Admin Dashboard",
}

export default async function AdminPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    redirect("/dashboard")
  }

  const [userCount, schoolCount, documentCount, subscriptionCount] = await Promise.all([
    prisma.user.count(),
    prisma.school.count(),
    prisma.document.count(),
    prisma.subscription.count(),
  ])

  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  })

  return (
    <AdminClient
      stats={{ users: userCount, schools: schoolCount, documents: documentCount, subscriptions: subscriptionCount }}
      recentUsers={recentUsers}
    />
  )
}
