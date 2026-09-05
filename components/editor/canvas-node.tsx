"use client"

import { Handle, NodeResizer, Position, useReactFlow } from "@xyflow/react"
import type { NodeProps } from "@xyflow/react"
import { useEffect, useRef, useState } from "react"
import type { ChangeEvent, CSSProperties, KeyboardEvent, MouseEvent } from "react"

import { useCanvasNodeActions } from "@/components/editor/canvas-node-context"
import { NodeColorToolbar } from "@/components/editor/node-color-toolbar"
import { ShapeVisual } from "@/components/editor/shape-visual"
import { getNodeTextColor, MIN_NODE_HEIGHT, MIN_NODE_WIDTH } from "@/types/canvas"
import type { CanvasNode } from "@/types/canvas"

const HANDLE_CLASS =
  "!h-2 !w-2 !rounded-full !border-2 opacity-0 transition-opacity group-hover:opacity-100"
const HANDLE_STYLE: CSSProperties = {
  backgroundColor: "var(--text-primary)",
  borderColor: "var(--bg-base)",
}
const RESIZER_HANDLE_CLASS = "!h-1.5 !w-1.5 !rounded-full !border-0"

function CanvasNodeRenderer({ id, data, width, height, selected }: NodeProps<CanvasNode>) {
  const textColor = getNodeTextColor(data.color)
  const { getNode } = useReactFlow<CanvasNode>()
  const onNodesChange = useCanvasNodeActions()
  const [isEditing, setIsEditing] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isEditing) {
      textareaRef.current?.focus()
      textareaRef.current?.select()
    }
  }, [isEditing])

  function updateLabel(label: string) {
    const node = getNode(id)
    if (!node) return

    onNodesChange([
      {
        id,
        type: "replace",
        item: { ...node, data: { ...node.data, label } },
      },
    ])
  }

  function updateColor(color: string) {
    const node = getNode(id)
    if (!node) return

    onNodesChange([
      {
        id,
        type: "replace",
        item: { ...node, data: { ...node.data, color } },
      },
    ])
  }

  function handleLabelDoubleClick(event: MouseEvent<HTMLDivElement>) {
    event.stopPropagation()
    setIsEditing(true)
  }

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    updateLabel(event.target.value)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Escape") {
      event.stopPropagation()
      textareaRef.current?.blur()
    }
  }

  return (
    <div className="group relative" style={{ width, height }}>
      <NodeResizer
        isVisible={selected}
        minWidth={MIN_NODE_WIDTH}
        minHeight={MIN_NODE_HEIGHT}
        color="var(--border-subtle)"
        handleClassName={RESIZER_HANDLE_CLASS}
      />
      {selected && <NodeColorToolbar activeColor={data.color} onSelect={updateColor} />}
      <ShapeVisual shape={data.shape} fill={data.color} selected={selected} />
      <div
        onDoubleClick={handleLabelDoubleClick}
        className="absolute inset-0 flex items-center justify-center px-3 text-center text-sm font-medium"
        style={{ color: textColor }}
      >
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={data.label}
            onChange={handleChange}
            onBlur={() => setIsEditing(false)}
            onKeyDown={handleKeyDown}
            placeholder="Label"
            rows={1}
            className="nodrag nopan nowheel max-h-full w-full resize-none bg-transparent text-center outline-none placeholder:text-copy-faint"
            style={{ color: textColor }}
          />
        ) : data.label ? (
          <span className="line-clamp-3 break-words">{data.label}</span>
        ) : (
          <span className="text-copy-faint">Label</span>
        )}
      </div>
      <Handle
        type="target"
        position={Position.Top}
        className={HANDLE_CLASS}
        style={HANDLE_STYLE}
      />
      <Handle
        type="source"
        position={Position.Right}
        className={HANDLE_CLASS}
        style={HANDLE_STYLE}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className={HANDLE_CLASS}
        style={HANDLE_STYLE}
      />
      <Handle
        type="target"
        position={Position.Left}
        className={HANDLE_CLASS}
        style={HANDLE_STYLE}
      />
    </div>
  )
}

export { CanvasNodeRenderer }
