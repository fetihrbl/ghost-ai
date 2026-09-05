import { currentUser } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"

import { getCursorColorForUser, getLiveblocksClient } from "@/lib/liveblocks"
import { prisma } from "@/lib/prisma"
import { getCurrentIdentity, hasProjectAccess } from "@/lib/project-access"

interface LiveblocksAuthInput {
  room?: string
}

function parseLiveblocksAuthInput(value: unknown): LiveblocksAuthInput {
  if (typeof value !== "object" || value === null) {
    return {}
  }

  const record = value as Record<string, unknown>
  return typeof record.room === "string" ? { room: record.room } : {}
}

export async function POST(request: NextRequest) {
  const identity = await getCurrentIdentity()

  if (!identity.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body: unknown = await request.json().catch(() => null)
  const { room: projectId } = parseLiveblocksAuthInput(body)

  if (!projectId) {
    return NextResponse.json({ error: "room is required" }, { status: 400 })
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { collaborators: true },
  })

  if (!project || !hasProjectAccess(project, identity)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const userId = identity.userId
  const user = await currentUser()
  const name = user?.fullName || user?.username || identity.email || "Anonymous"
  const avatar = user?.imageUrl ?? ""
  const color = getCursorColorForUser(userId)
  const liveblocks = getLiveblocksClient()

  await liveblocks.getOrCreateRoom(projectId, {
    defaultAccesses: [],
    usersAccesses: { [userId]: ["room:write"] },
  })

  await liveblocks.updateRoom(projectId, {
    usersAccesses: { [userId]: ["room:write"] },
  })

  const { status, body: authBody } = await liveblocks.identifyUser(
    { userId, groupIds: [] },
    { userInfo: { name, avatar, color } }
  )

  return new Response(authBody, { status })
}
