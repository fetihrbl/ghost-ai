"use client"

import { useLiveblocksFlow } from "@liveblocks/react-flow"
import { useCanRedo, useCanUndo, useRedo, useUndo } from "@liveblocks/react"
import {
  Background,
  BackgroundVariant,
  ConnectionMode,
  MarkerType,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react"
import type { DefaultEdgeOptions } from "@xyflow/react"
import { useEffect, useRef } from "react"
import type { DragEvent } from "react"

import { CanvasControls } from "@/components/editor/canvas-controls"
import { CanvasEdgeRenderer } from "@/components/editor/canvas-edge"
import { CanvasEdgeActionsContext } from "@/components/editor/canvas-edge-context"
import { CanvasNodeRenderer } from "@/components/editor/canvas-node"
import { CanvasNodeActionsContext } from "@/components/editor/canvas-node-context"
import { ShapePanel } from "@/components/editor/shape-panel"
import type { CanvasTemplate } from "@/components/editor/starter-templates"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { DEFAULT_EDGE_COLOR, DEFAULT_NODE_COLOR, SHAPE_DRAG_MIME_TYPE } from "@/types/canvas"
import type { CanvasEdge, CanvasNode, ShapeDragPayload } from "@/types/canvas"

import "@xyflow/react/dist/style.css"

const NODE_TYPES = { canvasNode: CanvasNodeRenderer }
const EDGE_TYPES = { canvasEdge: CanvasEdgeRenderer }
const DEFAULT_EDGE_OPTIONS: DefaultEdgeOptions = {
  type: "canvasEdge",
  markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18, color: DEFAULT_EDGE_COLOR },
}
const TEMPLATE_FIT_VIEW_DURATION = 300

type ImportTemplate = (template: CanvasTemplate) => void

interface CanvasFlowProps {
  onCanvasReady?: (importTemplate: ImportTemplate | null) => void
}

function CanvasFlow({ onCanvasReady }: CanvasFlowProps) {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow<CanvasNode, CanvasEdge>({
      suspense: true,
      nodes: { initial: [] },
      edges: { initial: [] },
    })
  const reactFlowInstance = useReactFlow()
  const { screenToFlowPosition } = reactFlowInstance
  const nodeCounterRef = useRef(0)

  const undo = useUndo()
  const redo = useRedo()
  const canUndo = useCanUndo()
  const canRedo = useCanRedo()

  useKeyboardShortcuts({ reactFlowInstance, undo, redo })

  function importTemplate(template: CanvasTemplate) {
    onDelete({ nodes, edges })

    const idMap = new Map<string, string>()
    const importedNodes: CanvasNode[] = template.nodes.map((node) => {
      const id = `${template.id}-${node.id}-${Date.now()}`
      idMap.set(node.id, id)
      return { ...node, id }
    })
    const importedEdges: CanvasEdge[] = template.edges.map((edge) => ({
      ...edge,
      id: `${template.id}-${edge.id}-${Date.now()}`,
      source: idMap.get(edge.source) ?? edge.source,
      target: idMap.get(edge.target) ?? edge.target,
    }))

    onNodesChange(importedNodes.map((item) => ({ type: "add" as const, item })))
    onEdgesChange(importedEdges.map((item) => ({ type: "add" as const, item })))

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        reactFlowInstance.fitView({ duration: TEMPLATE_FIT_VIEW_DURATION })
      })
    })
  }

  useEffect(() => {
    onCanvasReady?.(importTemplate)
    return () => onCanvasReady?.(null)
  })

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    event.dataTransfer.dropEffect = "copy"
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()

    const raw = event.dataTransfer.getData(SHAPE_DRAG_MIME_TYPE)
    if (!raw) return

    let payload: ShapeDragPayload
    try {
      payload = JSON.parse(raw) as ShapeDragPayload
    } catch {
      return
    }

    const position = screenToFlowPosition({ x: event.clientX, y: event.clientY })
    nodeCounterRef.current += 1
    const id = `${payload.shape}-${Date.now()}-${nodeCounterRef.current}`

    const newNode: CanvasNode = {
      id,
      type: "canvasNode",
      position,
      width: payload.width,
      height: payload.height,
      data: {
        label: "",
        color: DEFAULT_NODE_COLOR.fill,
        shape: payload.shape,
      },
    }

    onNodesChange([{ type: "add", item: newNode }])
  }

  return (
    <CanvasNodeActionsContext.Provider value={onNodesChange}>
      <CanvasEdgeActionsContext.Provider value={onEdgesChange}>
        <div className="relative h-full w-full" onDragOver={handleDragOver} onDrop={handleDrop}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={NODE_TYPES}
            edgeTypes={EDGE_TYPES}
            defaultEdgeOptions={DEFAULT_EDGE_OPTIONS}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDelete={onDelete}
            connectionMode={ConnectionMode.Loose}
            fitView
          >
            <Background variant={BackgroundVariant.Dots} />
          </ReactFlow>
          <CanvasControls
            reactFlowInstance={reactFlowInstance}
            undo={undo}
            redo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
          />
          <ShapePanel />
        </div>
      </CanvasEdgeActionsContext.Provider>
    </CanvasNodeActionsContext.Provider>
  )
}

interface CanvasProps {
  onCanvasReady?: (importTemplate: ImportTemplate | null) => void
}

function Canvas({ onCanvasReady }: CanvasProps) {
  return (
    <ReactFlowProvider>
      <CanvasFlow onCanvasReady={onCanvasReady} />
    </ReactFlowProvider>
  )
}

export { Canvas }
export type { ImportTemplate }
