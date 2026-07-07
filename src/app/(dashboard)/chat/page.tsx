import { auth } from "@/lib/auth"
import { ChatClient } from "./chat-client"

export const metadata = {
  title: "AI Chat",
}

export default async function ChatPage() {
  const session = await auth()
  return <ChatClient userName={session?.user?.name || "Teacher"} />
}
