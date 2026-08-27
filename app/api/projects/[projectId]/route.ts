import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

interface RouteParams {
  params: Promise<{ projectId: string }>
}

interface RenameProjectInput {
  name?: string
}

function parseRenameProjectInput(value: unknown): RenameProjectInput {
  if (typeof value !== "object" || value === null) {
    return {}
  }

  const record = value as Record<string, unknown>
  return typeof record.name === "string" ? { name: record.name } : {}
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { isAuthenticated, userId } = await auth()

  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { projectId } = await params
  const project = await prisma.project.findUnique({ where: { id: projectId } })

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  if (project.ownerId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body: unknown = await request.json().catch(() => null)
  const { name } = parseRenameProjectInput(body)

  if (!name?.trim()) {
    return NextResponse.json({ error: "name is required" }, { status: 400 })
  }

  const updated = await prisma.project.update({
    where: { id: projectId },
    data: { name: name.trim() },
  })

  return NextResponse.json({ project: updated })
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { isAuthenticated, userId } = await auth()

  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { projectId } = await params
  const project = await prisma.project.findUnique({ where: { id: projectId } })

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  if (project.ownerId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  await prisma.project.delete({ where: { id: projectId } })

  return new NextResponse(null, { status: 204 })
}
