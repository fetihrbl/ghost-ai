import { prisma } from "@/lib/prisma"

function getOwnedProjects(ownerId: string) {
  return prisma.project.findMany({
    where: { ownerId },
    orderBy: { createdAt: "desc" },
  })
}

function getSharedProjects(email: string) {
  if (!email) return Promise.resolve([])

  return prisma.project.findMany({
    where: { collaborators: { some: { email } } },
    orderBy: { createdAt: "desc" },
  })
}

export { getOwnedProjects, getSharedProjects }
