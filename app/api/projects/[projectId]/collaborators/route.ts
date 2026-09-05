import { NextRequest, NextResponse } from "next/server"

import { Prisma } from "@/app/generated/prisma/client"
import { enrichWithClerkData } from "@/lib/collaborators"
import { prisma } from "@/lib/prisma"
import { getCurrentIdentity, hasProjectAccess } from "@/lib/project-access"

interface RouteParams {
  params: Promise<{ projectId: string }>
}

interface InviteCollaboratorInput {
  email?: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function parseInviteCollaboratorInput(value: unknown): InviteCollaboratorInput {
  if (typeof value !== "object" || value === null) {
    return {}
  }

  const record = value as Record<string, unknown>
  return typeof record.email === "string" ? { email: record.email } : {}
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const identity = await getCurrentIdentity()

  if (!identity.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { projectId } = await params
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { collaborators: true },
  })

  if (!project || !hasProjectAccess(project, identity)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const collaborators = await enrichWithClerkData(project.collaborators)

  return NextResponse.json({ collaborators })
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const identity = await getCurrentIdentity()

  if (!identity.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { projectId } = await params
  const project = await prisma.project.findUnique({ where: { id: projectId } })

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  if (project.ownerId !== identity.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body: unknown = await request.json().catch(() => null)
  const { email } = parseInviteCollaboratorInput(body)
  const trimmedEmail = email?.trim().toLowerCase()

  if (!trimmedEmail || !EMAIL_PATTERN.test(trimmedEmail)) {
    return NextResponse.json(
      { error: "A valid email is required" },
      { status: 400 }
    )
  }

  try {
    const record = await prisma.projectCollaborator.create({
      data: { projectId, email: trimmedEmail },
    })
    const [collaborator] = await enrichWithClerkData([record])

    return NextResponse.json({ collaborator }, { status: 201 })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Already a collaborator" },
        { status: 409 }
      )
    }
    throw error
  }
}
