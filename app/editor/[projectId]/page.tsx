import { auth } from "@clerk/nextjs/server"
import { notFound, redirect } from "next/navigation"

import { EditorShell } from "@/components/editor/editor-shell"
import { getCurrentUserEmail } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getOwnedProjects, getSharedProjects } from "@/lib/projects"

interface ProjectWorkspacePageProps {
  params: Promise<{ projectId: string }>
}

export default async function ProjectWorkspacePage({
  params,
}: ProjectWorkspacePageProps) {
  const { projectId } = await params
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const email = await getCurrentUserEmail()

  const [project, ownedProjects, sharedProjects] = await Promise.all([
    prisma.project.findUnique({
      where: { id: projectId },
      include: { collaborators: true },
    }),
    getOwnedProjects(userId),
    getSharedProjects(email),
  ])

  if (!project) {
    notFound()
  }

  const hasAccess =
    project.ownerId === userId ||
    project.collaborators.some((collaborator) => collaborator.email === email)

  if (!hasAccess) {
    notFound()
  }

  return (
    <EditorShell
      ownedProjects={ownedProjects}
      sharedProjects={sharedProjects}
      activeProject={project}
    />
  )
}
