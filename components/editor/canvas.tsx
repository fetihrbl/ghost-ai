"use client"

import { useLiveblocksFlow } from "@liveblocks/react-flow"
import {
  Background,
  BackgroundVariant,
  ConnectionMode,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react"
import { useRef } from "react"
import type { DragEvent } from "react"

import { CanvasNodeRenderer } from "@/components/editor/canvas-node"
import { ShapePanel } from "@/components/editor/shape-panel"
import { DEFAULT_NODE_COLOR, SHAPE_DRAG_MIME_TYPE } from "@/types/canvas"
import type { CanvasEdge, CanvasNode, ShapeDragPayload } from "@/types/canvas"

import "@xyflow/react/dist/style.css"

const NODE_TYPES = { canvasNode: CanvasNodeRenderer }

function CanvasFlow() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow<CanvasNode, CanvasEdge>({
      suspense: true,
      nodes: { initial: [] },
      edges: { initial: [] },
    })
  const { screenToFlowPosition } = useReactFlow()
  const nodeCounterRef = useRef(0)

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
    <div className="relative h-full w-full" onDragOver={handleDragOver} onDrop={handleDrop}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={NODE_TYPES}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDelete={onDelete}
        connectionMode={ConnectionMode.Loose}
        fitView
      >
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} />
      </ReactFlow>
      <ShapePanel />
    </div>
  )
}

function Canvas() {
  return (
    <ReactFlowProvider>
      <CanvasFlow />
    </ReactFlowProvider>
  )
}

export { Canvas }
