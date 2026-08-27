import { clerkClient } from "@clerk/nextjs/server"

import type { Collaborator } from "@/types/collaborator"

interface CollaboratorRecord {
  id: string
  email: string
}

async function enrichWithClerkData(
  collaborators: CollaboratorRecord[]
): Promise<Collaborator[]> {
  if (collaborators.length === 0) return []

  const client = await clerkClient()
  const { data: users } = await client.users.getUserList({
    emailAddress: collaborators.map((collaborator) => collaborator.email),
  })

  const userByEmail = new Map(
    users.flatMap((user) =>
      user.emailAddresses.map(
        (address) => [address.emailAddress, user] as const
      )
    )
  )

  return collaborators.map((collaborator) => {
    const user = userByEmail.get(collaborator.email)
    return {
      id: collaborator.id,
      email: collaborator.email,
      name: user?.fullName ?? null,
      imageUrl: user?.imageUrl ?? null,
    }
  })
}

export { enrichWithClerkData }
