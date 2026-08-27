"use client"

import { useState } from "react"
import { Send, Sparkles, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface AiSidebarProps {
  isOpen: boolean
  onClose: () => void
}

function AiSidebar({ isOpen, onClose }: AiSidebarProps) {
  const [message, setMessage] = useState("")

  return (
    <aside
      aria-hidden={!isOpen}
      inert={!isOpen}
      className={cn(
        "fixed top-14 right-0 bottom-0 z-40 flex w-80 translate-x-full flex-col border-l border-surface-border bg-surface/95 backdrop-blur-xl transition-transform duration-200 ease-out",
        isOpen && "translate-x-0"
      )}
    >
      <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
        <h2 className="text-sm font-medium text-copy-primary">
          AI Assistant
        </h2>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          aria-label="Close AI sidebar"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
        <Sparkles className="h-8 w-8 text-copy-faint" />
        <p className="text-sm text-copy-muted">AI chat coming soon.</p>
      </div>
      <div className="flex items-end gap-2 border-t border-surface-border p-3">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe the system you want to build..."
          rows={2}
          className="min-h-0 resize-none"
        />
        <Button
          size="icon"
          aria-label="Send message"
          disabled={!message.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </aside>
  )
}

export { AiSidebar }
