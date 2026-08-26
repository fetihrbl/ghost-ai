"use client"

import { useEffect, useRef } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  EditorDialogContent,
  EditorDialogFooter,
} from "@/components/editor/editor-dialog"
import type { useProjectDialogs } from "@/hooks/use-project-dialogs"

interface ProjectDialogsProps {
  dialogs: ReturnType<typeof useProjectDialogs>
}

function ProjectDialogs({ dialogs }: ProjectDialogsProps) {
  const {
    dialog,
    name,
    slug,
    isLoading,
    setName,
    closeDialog,
    createProject,
    renameProject,
    deleteProject,
  } = dialogs

  const renameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (dialog?.type === "rename") {
      renameInputRef.current?.focus()
      renameInputRef.current?.select()
    }
  }, [dialog])

  return (
    <>
      <Dialog
        open={dialog?.type === "create"}
        onOpenChange={(open) => !open && closeDialog()}
      >
        <EditorDialogContent>
          <DialogHeader>
            <DialogTitle>Create project</DialogTitle>
            <DialogDescription>
              Name your new architecture workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Project name"
            />
            <p className="truncate text-sm text-copy-muted">
              {slug || "your-project-slug"}
            </p>
          </div>
          <EditorDialogFooter>
            <Button variant="ghost" onClick={closeDialog} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              onClick={createProject}
              disabled={isLoading || !name.trim()}
            >
              Create project
            </Button>
          </EditorDialogFooter>
        </EditorDialogContent>
      </Dialog>

      <Dialog
        open={dialog?.type === "rename"}
        onOpenChange={(open) => !open && closeDialog()}
      >
        <EditorDialogContent>
          <DialogHeader>
            <DialogTitle>Rename project</DialogTitle>
            <DialogDescription>
              {dialog?.type === "rename"
                ? `Renaming "${dialog.project.name}"`
                : null}
            </DialogDescription>
          </DialogHeader>
          <Input
            ref={renameInputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") renameProject()
            }}
            placeholder="Project name"
          />
          <EditorDialogFooter>
            <Button variant="ghost" onClick={closeDialog} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              onClick={renameProject}
              disabled={isLoading || !name.trim()}
            >
              Save
            </Button>
          </EditorDialogFooter>
        </EditorDialogContent>
      </Dialog>

      <Dialog
        open={dialog?.type === "delete"}
        onOpenChange={(open) => !open && closeDialog()}
      >
        <EditorDialogContent>
          <DialogHeader>
            <DialogTitle>Delete project</DialogTitle>
            <DialogDescription>
              {dialog?.type === "delete"
                ? `This will permanently delete "${dialog.project.name}". This action cannot be undone.`
                : null}
            </DialogDescription>
          </DialogHeader>
          <EditorDialogFooter>
            <Button variant="ghost" onClick={closeDialog} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={deleteProject}
              disabled={isLoading}
            >
              Delete project
            </Button>
          </EditorDialogFooter>
        </EditorDialogContent>
      </Dialog>
    </>
  )
}

export { ProjectDialogs }
