"use client"

import { ClientSideSuspense, LiveblocksProvider, RoomProvider } from "@liveblocks/react/suspense"

import { Canvas } from "@/components/editor/canvas"
import { CanvasErrorBoundary } from "@/components/editor/canvas-error-boundary"
import { CanvasErrorFallback } from "@/components/editor/canvas-error-fallback"
import { CanvasLoading } from "@/components/editor/canvas-loading"
import type { Project } from "@/types/project"

interface EditorWorkspaceProps {
  project: Project
}

function EditorWorkspace({ project }: EditorWorkspaceProps) {
  return (
    <div className="absolute inset-0 bg-base">
      <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
        <RoomProvider
          id={project.id}
          initialPresence={{ cursor: null, isThinking: false }}
        >
          <CanvasErrorBoundary fallback={<CanvasErrorFallback />}>
            <ClientSideSuspense fallback={<CanvasLoading />}>
              <Canvas />
            </ClientSideSuspense>
          </CanvasErrorBoundary>
        </RoomProvider>
      </LiveblocksProvider>
    </div>
  )
}

export { EditorWorkspace }
