"use client"

import { createContext, useContext } from "react"
import type { OnEdgesChange } from "@xyflow/react"

import type { CanvasEdge } from "@/types/canvas"

const CanvasEdgeActionsContext = createContext<OnEdgesChange<CanvasEdge> | null>(null)

function useCanvasEdgeActions(): OnEdgesChange<CanvasEdge> {
  const onEdgesChange = useContext(CanvasEdgeActionsContext)
  if (!onEdgesChange) {
    throw new Error("useCanvasEdgeActions must be used within CanvasEdgeActionsContext.Provider")
  }
  return onEdgesChange
}

export { CanvasEdgeActionsContext, useCanvasEdgeActions }
