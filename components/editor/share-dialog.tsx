"use client"

import { useEffect, useState } from "react"
import { Check, Copy, UserRound, X } from "lucide-react"

import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  EditorDialogContent,
  EditorDialogFooter,
} from "@/components/editor/editor-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Collaborator } from "@/types/collaborator"

interface ShareDialogProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
  isOwner: boolean
}

function ShareDialog({ isOpen, onClose, projectId, isOwner }: ShareDialogProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [isInviting, setIsInviting] = useState(false)
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    let cancelled = false

    async function loadCollaborators() {
      setIsLoading(true)
      try {
        const response = await fetch(
          `/api/projects/${projectId}/collaborators`
        )
        const data: { collaborators: Collaborator[] } = await response.json()
        if (!cancelled) setCollaborators(data.collaborators ?? [])
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadCollaborators()

    return () => {
      cancelled = true
    }
  }, [isOpen, projectId])

  async function inviteCollaborator() {
    const trimmed = email.trim()
    if (!trimmed) return

    setIsInviting(true)
    setInviteError(null)
    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      })
      const data = await response.json().catch(() => null)

      if (!response.ok) {
        setInviteError(data?.error ?? "Failed to invite collaborator")
        return
      }

      setCollaborators((prev) => [...prev, data.collaborator as Collaborator])
      setEmail("")
    } finally {
      setIsInviting(false)
    }
  }

  async function removeCollaborator(collaborator: Collaborator) {
    setRemovingId(collaborator.id)
    try {
      const response = await fetch(
        `/api/projects/${projectId}/collaborators/${collaborator.id}`,
        { method: "DELETE" }
      )
      if (!response.ok) return

      setCollaborators((prev) => prev.filter((c) => c.id !== collaborator.id))
    } finally {
      setRemovingId(null)
    }
  }

  async function copyLink() {
    const url = `${window.location.origin}/editor/${projectId}`
    await navigator.clipboard.writeText(url)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <EditorDialogContent>
        <DialogHeader>
          <DialogTitle>Share project</DialogTitle>
          <DialogDescription>
            {isOwner
              ? "Invite collaborators by email."
              : "People with access to this project."}
          </DialogDescription>
        </DialogHeader>

        {isOwner ? (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") inviteCollaborator()
                }}
                type="email"
                placeholder="Email address"
              />
              <Button
                onClick={inviteCollaborator}
                disabled={isInviting || !email.trim()}
              >
                Invite
              </Button>
            </div>
            {inviteError ? (
              <p className="text-sm text-state-error">{inviteError}</p>
            ) : null}
          </div>
        ) : null}

        <div className="flex flex-col gap-1">
          {isLoading ? (
            <div className="flex h-24 items-center justify-center text-sm text-copy-muted">
              Loading...
            </div>
          ) : collaborators.length === 0 ? (
            <div className="flex h-24 items-center justify-center text-sm text-copy-muted">
              No collaborators yet
            </div>
          ) : (
            <ul className="flex max-h-64 flex-col gap-0.5 overflow-y-auto">
              {collaborators.map((collaborator) => (
                <li
                  key={collaborator.id}
                  className="flex items-center justify-between gap-2 rounded-xl px-2 py-1.5 hover:bg-elevated"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    {collaborator.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={collaborator.imageUrl}
                        alt=""
                        className="h-8 w-8 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-elevated">
                        <UserRound className="h-4 w-4 text-copy-muted" />
                      </div>
                    )}
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-sm text-copy-primary">
                        {collaborator.name ?? collaborator.email}
                      </span>
                      {collaborator.name ? (
                        <span className="truncate text-xs text-copy-muted">
                          {collaborator.email}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  {isOwner ? (
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      aria-label={`Remove ${collaborator.email}`}
                      onClick={() => removeCollaborator(collaborator)}
                      disabled={removingId === collaborator.id}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>

        <EditorDialogFooter className="sm:justify-between">
          <Button variant="ghost" onClick={copyLink}>
            {isCopied ? (
              <>
                <Check className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy link
              </>
            )}
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </EditorDialogFooter>
      </EditorDialogContent>
    </Dialog>
  )
}

export { ShareDialog }
