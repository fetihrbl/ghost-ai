"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import type { Project } from "@/types/project"

type ProjectActionState =
  | { type: "create" }
  | { type: "rename"; project: Project }
  | { type: "delete"; project: Project }
  | null

interface UseProjectActionsOptions {
  activeProjectId?: string
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function generateSuffix(length = 5): string {
  return Math.random().toString(36).slice(2, 2 + length)
}

function useProjectActions(options: UseProjectActionsOptions = {}) {
  const { activeProjectId } = options
  const router = useRouter()

  const [dialog, setDialog] = useState<ProjectActionState>(null)
  const [name, setName] = useState("")
  const [suffix, setSuffix] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const roomId = useMemo(() => {
    const base = slugify(name)
    return base ? `${base}-${suffix}` : suffix
  }, [name, suffix])

  function openCreateDialog() {
    setName("")
    setSuffix(generateSuffix())
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
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      })
      if (!response.ok) return

      const { project } = (await response.json()) as { project: Project }
      closeDialog()
      router.push(`/editor/${project.id}`)
    } finally {
      setIsLoading(false)
    }
  }

  async function renameProject() {
    if (dialog?.type !== "rename") return
    const trimmed = name.trim()
    if (!trimmed) return

    const { project } = dialog
    setIsLoading(true)
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      })
      if (!response.ok) return

      closeDialog()
      router.refresh()
    } finally {
      setIsLoading(false)
    }
  }

  async function deleteProject() {
    if (dialog?.type !== "delete") return
    const { project } = dialog

    setIsLoading(true)
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "DELETE",
      })
      if (!response.ok) return

      closeDialog()
      if (project.id === activeProjectId) {
        router.push("/editor")
      } else {
        router.refresh()
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    dialog,
    name,
    roomId,
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

export { useProjectActions }
export type { ProjectActionState }
