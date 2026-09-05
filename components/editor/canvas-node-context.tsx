"use client"

import { createContext, useContext } from "react"
import type { OnNodesChange } from "@xyflow/react"

import type { CanvasNode } from "@/types/canvas"

const CanvasNodeActionsContext = createContext<OnNodesChange<CanvasNode> | null>(null)

function useCanvasNodeActions(): OnNodesChange<CanvasNode> {
  const onNodesChange = useContext(CanvasNodeActionsContext)
  if (!onNodesChange) {
    throw new Error("useCanvasNodeActions must be used within CanvasNodeActionsContext.Provider")
  }
  return onNodesChange
}

export { CanvasNodeActionsContext, useCanvasNodeActions }
