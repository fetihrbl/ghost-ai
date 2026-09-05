"use client"

import { EdgeLabelRenderer, getSmoothStepPath, useReactFlow } from "@xyflow/react"
import type { EdgeProps } from "@xyflow/react"
import { useEffect, useRef, useState } from "react"
import type { KeyboardEvent, MouseEvent } from "react"

import { useCanvasEdgeActions } from "@/components/editor/canvas-edge-context"
import { DEFAULT_EDGE_COLOR } from "@/types/canvas"
import type { CanvasEdge, CanvasNode } from "@/types/canvas"

const EDGE_STROKE_WIDTH = 1.5
const EDGE_INTERACTION_WIDTH = 20
const DIMMED_OPACITY = 0.5

function CanvasEdgeRenderer({
  id,
  data,
  selected,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
}: EdgeProps<CanvasEdge>) {
  const { getEdge } = useReactFlow<CanvasNode, CanvasEdge>()
  const onEdgesChange = useCanvasEdgeActions()
  const [isHovered, setIsHovered] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const isActive = Boolean(selected) || isHovered || isEditing
  const label = data?.label ?? ""

  const [path, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 0,
  })

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

  function updateLabel(nextLabel: string) {
    const edge = getEdge(id)
    if (!edge) return

    onEdgesChange([
      {
        id,
        type: "replace",
        item: { ...edge, data: { ...edge.data, label: nextLabel } },
      },
    ])
  }

  function handleDoubleClick(event: MouseEvent<SVGPathElement | HTMLDivElement>) {
    event.stopPropagation()
    setIsEditing(true)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === "Escape") {
      event.stopPropagation()
      inputRef.current?.blur()
    }
  }

  return (
    <>
      <path
        d={path}
        fill="none"
        className="react-flow__edge-path transition-[opacity,stroke] duration-150"
        style={{
          stroke: DEFAULT_EDGE_COLOR,
          strokeWidth: EDGE_STROKE_WIDTH,
          strokeLinecap: "round",
          opacity: isActive ? 1 : DIMMED_OPACITY,
        }}
        markerEnd={markerEnd}
      />
      <path
        d={path}
        fill="none"
        strokeOpacity={0}
        strokeWidth={EDGE_INTERACTION_WIDTH}
        className="cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onDoubleClick={handleDoubleClick}
      />
      <EdgeLabelRenderer>
        <div
          className="nodrag nopan nowheel absolute z-10"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "all",
          }}
          onDoubleClick={handleDoubleClick}
        >
          {isEditing ? (
            <input
              ref={inputRef}
              value={label}
              onChange={(event) => updateLabel(event.target.value)}
              onBlur={() => setIsEditing(false)}
              onKeyDown={handleKeyDown}
              placeholder="Add label"
              className="min-w-[3ch] rounded-full border border-brand bg-surface px-2 py-0.5 text-center text-xs text-copy-primary outline-none placeholder:text-copy-faint"
              style={{ width: `${Math.max(label.length, 1) + 1}ch` }}
            />
          ) : label ? (
            <span className="rounded-full border border-surface-border bg-surface px-2 py-0.5 text-xs text-copy-secondary shadow-lg">
              {label}
            </span>
          ) : isActive ? (
            <span className="rounded-full px-2 py-0.5 text-xs text-copy-faint">Add label</span>
          ) : null}
        </div>
      </EdgeLabelRenderer>
    </>
  )
}

export { CanvasEdgeRenderer }
