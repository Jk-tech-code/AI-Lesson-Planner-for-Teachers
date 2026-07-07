import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { DocumentsClient } from "./documents-client"

export const metadata = {
  title: "Documents",
}

export default async function DocumentsPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  const documents = await prisma.document.findMany({
    where: { userId: session.user.id, isArchived: false },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  const folders = await prisma.folder.findMany({
    where: { userId: session.user.id },
    orderBy: { name: "asc" },
  })

  return <DocumentsClient documents={documents} folders={folders} />
}
