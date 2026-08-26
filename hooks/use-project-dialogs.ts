"use client"

import { useMemo, useState } from "react"

import type { Project } from "@/types/project"

type ProjectDialogState =
  | { type: "create" }
  | { type: "rename"; project: Project }
  | { type: "delete"; project: Project }
  | null

const INITIAL_PROJECTS: Project[] = [
  {
    id: "1",
    name: "Checkout Service Redesign",
    slug: "checkout-service-redesign",
    role: "owner",
  },
  {
    id: "2",
    name: "Realtime Notifications Pipeline",
    slug: "realtime-notifications-pipeline",
    role: "owner",
  },
  {
    id: "3",
    name: "Payments Platform Migration",
    slug: "payments-platform-migration",
    role: "collaborator",
  },
]

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function useProjectDialogs() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS)
  const [dialog, setDialog] = useState<ProjectDialogState>(null)
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const slug = useMemo(() => slugify(name), [name])

  const myProjects = useMemo(
    () => projects.filter((project) => project.role === "owner"),
    [projects]
  )
  const sharedProjects = useMemo(
    () => projects.filter((project) => project.role === "collaborator"),
    [projects]
  )

  function openCreateDialog() {
    setName("")
    setDialog({ type: "create" })
  }

  function openRenameDialog(project: Project) {
    setName(project.name)
    setDialog({ type: "rename", project })
  }

  function openDeleteDialog(project: Project) {
    setDialog({ type: "delete", project })
  }

  function closeDialog() {
    setDialog(null)
    setName("")
  }

  async function createProject() {
    const trimmed = name.trim()
    if (!trimmed) return

    setIsLoading(true)
    await wait(400)
    setProjects((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: trimmed, slug: slugify(trimmed), role: "owner" },
    ])
    setIsLoading(false)
    closeDialog()
  }

  async function renameProject() {
    if (dialog?.type !== "rename") return
    const trimmed = name.trim()
    if (!trimmed) return

    const { project } = dialog
    setIsLoading(true)
    await wait(400)
    setProjects((prev) =>
      prev.map((p) =>
        p.id === project.id ? { ...p, name: trimmed, slug: slugify(trimmed) } : p
      )
    )
    setIsLoading(false)
    closeDialog()
  }

  async function deleteProject() {
    if (dialog?.type !== "delete") return
    const { project } = dialog

    setIsLoading(true)
    await wait(400)
    setProjects((prev) => prev.filter((p) => p.id !== project.id))
    setIsLoading(false)
    closeDialog()
  }

  return {
    myProjects,
    sharedProjects,
    dialog,
    name,
    slug,
    isLoading,
    setName,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    closeDialog,
    createProject,
    renameProject,
    deleteProject,
  }
}

export { useProjectDialogs }
export type { ProjectDialogState }
