import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"
import { getOwnedProjects } from "@/lib/projects"

interface CreateProjectInput {
  name?: string
}

function parseCreateProjectInput(value: unknown): CreateProjectInput {
  if (typeof value !== "object" || value === null) {
    return {}
  }

  const record = value as Record<string, unknown>
  return typeof record.name === "string" ? { name: record.name } : {}
}

export async function GET() {
  const { isAuthenticated, userId } = await auth()

  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const projects = await getOwnedProjects(userId)

  return NextResponse.json({ projects })
}

export async function POST(request: NextRequest) {
  const { isAuthenticated, userId } = await auth()

  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body: unknown = await request.json().catch(() => null)
  const { name } = parseCreateProjectInput(body)

  const project = await prisma.project.create({
    data: {
      ownerId: userId,
      name: name?.trim() ? name.trim() : "Untitled Project",
    },
  })

  return NextResponse.json({ project }, { status: 201 })
}
