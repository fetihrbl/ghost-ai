import { redirect } from "next/navigation"

import { AccessDenied } from "@/components/editor/access-denied"
import { EditorShell } from "@/components/editor/editor-shell"
import { prisma } from "@/lib/prisma"
import { getCurrentIdentity, hasProjectAccess } from "@/lib/project-access"
import { getOwnedProjects, getSharedProjects } from "@/lib/projects"

interface RoomWorkspacePageProps {
  params: Promise<{ roomId: string }>
}

export default async function RoomWorkspacePage({
  params,
}: RoomWorkspacePageProps) {
  const { roomId } = await params
  const identity = await getCurrentIdentity()

  if (!identity.userId) {
    redirect("/sign-in")
  }

  const [project, ownedProjects, sharedProjects] = await Promise.all([
    prisma.project.findUnique({
      where: { id: roomId },
      include: { collaborators: true },
    }),
    getOwnedProjects(identity.userId),
    getSharedProjects(identity.email),
  ])

  if (!project || !hasProjectAccess(project, identity)) {
    return <AccessDenied />
  }

  return (
    <EditorShell
      ownedProjects={ownedProjects}
      sharedProjects={sharedProjects}
      activeProject={project}
      isOwner={project.ownerId === identity.userId}
    />
  )
}
