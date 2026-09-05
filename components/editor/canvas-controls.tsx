"use client"

import { Maximize, Redo2, Undo2, ZoomIn, ZoomOut } from "lucide-react"
import type { ReactFlowInstance } from "@xyflow/react"

const VIEWPORT_ANIMATION_DURATION = 300

interface CanvasControlsProps {
  reactFlowInstance: ReactFlowInstance
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
}

function CanvasControls({ reactFlowInstance, undo, redo, canUndo, canRedo }: CanvasControlsProps) {
  return (
    <div className="absolute bottom-24 left-6 z-10 flex items-center gap-1 rounded-full border border-surface-border bg-surface/90 p-2 shadow-lg backdrop-blur">
      <button
        type="button"
        onClick={() => reactFlowInstance.zoomOut({ duration: VIEWPORT_ANIMATION_DURATION })}
        aria-label="Zoom out"
        title="Zoom out"
        className="flex h-8 w-8 items-center justify-center rounded-full text-copy-secondary transition-colors hover:bg-elevated hover:text-copy-primary"
      >
        <ZoomOut className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => reactFlowInstance.fitView({ duration: VIEWPORT_ANIMATION_DURATION })}
        aria-label="Fit view"
        title="Fit view"
        className="flex h-8 w-8 items-center justify-center rounded-full text-copy-secondary transition-colors hover:bg-elevated hover:text-copy-primary"
      >
        <Maximize className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => reactFlowInstance.zoomIn({ duration: VIEWPORT_ANIMATION_DURATION })}
        aria-label="Zoom in"
        title="Zoom in"
        className="flex h-8 w-8 items-center justify-center rounded-full text-copy-secondary transition-colors hover:bg-elevated hover:text-copy-primary"
      >
        <ZoomIn className="h-4 w-4" />
      </button>

      <div className="mx-1 h-5 w-px bg-surface-border" />

      <button
        type="button"
        onClick={undo}
        disabled={!canUndo}
        aria-label="Undo"
        title="Undo"
        className="flex h-8 w-8 items-center justify-center rounded-full text-copy-secondary transition-colors hover:bg-elevated hover:text-copy-primary disabled:pointer-events-none disabled:opacity-40"
      >
        <Undo2 className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={redo}
        disabled={!canRedo}
        aria-label="Redo"
        title="Redo"
        className="flex h-8 w-8 items-center justify-center rounded-full text-copy-secondary transition-colors hover:bg-elevated hover:text-copy-primary disabled:pointer-events-none disabled:opacity-40"
      >
        <Redo2 className="h-4 w-4" />
      </button>
    </div>
  )
}

export { CanvasControls }
