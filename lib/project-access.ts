import { auth } from "@clerk/nextjs/server"

import { getCurrentUserEmail } from "@/lib/auth"

interface ProjectIdentity {
  userId: string | null
  email: string
}

interface AccessCheckableProject {
  ownerId: string
  collaborators: { email: string }[]
}

async function getCurrentIdentity(): Promise<ProjectIdentity> {
  const { userId } = await auth()
  const email = await getCurrentUserEmail()
  return { userId, email }
}

function hasProjectAccess(
  project: AccessCheckableProject,
  identity: ProjectIdentity
): boolean {
  if (!identity.userId) return false
  if (project.ownerId === identity.userId) return true
  return project.collaborators.some(
    (collaborator) => collaborator.email === identity.email
  )
}

export { getCurrentIdentity, hasProjectAccess }
export type { ProjectIdentity }
