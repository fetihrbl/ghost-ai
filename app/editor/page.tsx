import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

import { EditorShell } from "@/components/editor/editor-shell"
import { getCurrentUserEmail } from "@/lib/auth"
import { getOwnedProjects, getSharedProjects } from "@/lib/projects"

export default async function EditorPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const [ownedProjects, sharedProjects] = await Promise.all([
    getOwnedProjects(userId),
    getCurrentUserEmail().then(getSharedProjects),
  ])

  return (
    <EditorShell ownedProjects={ownedProjects} sharedProjects={sharedProjects} />
  )
}
