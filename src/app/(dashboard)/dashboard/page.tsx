import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { DashboardClient } from "./dashboard-client"

export const metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      subscription: true,
      schoolMembers: { include: { school: true } },
    },
  })

  const documentCount = await prisma.document.count({
    where: { userId: session.user.id },
  })

  const recentDocuments = await prisma.document.findMany({
    where: { userId: session.user.id, isArchived: false },
    orderBy: { createdAt: "desc" },
    take: 5,
  })

  const stats = {
    documents: documentCount,
    schemes: await prisma.schemeOfWork.count({ where: { userId: session.user.id } }),
    lessons: await prisma.generatedLesson.count({ where: { userId: session.user.id } }),
    assessments: await prisma.assessment.count({ where: { userId: session.user.id } }),
  }

  const subscriptionTier = user?.subscription?.tier || "FREE"

  return (
    <DashboardClient
      userName={user?.name || "Teacher"}
      stats={stats}
      recentDocuments={recentDocuments}
      subscriptionTier={subscriptionTier}
    />
  )
}
