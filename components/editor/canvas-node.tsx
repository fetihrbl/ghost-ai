"use client"

import { Handle, Position } from "@xyflow/react"
import type { NodeProps } from "@xyflow/react"

import { getNodeTextColor } from "@/types/canvas"
import type { CanvasNode } from "@/types/canvas"

function CanvasNodeRenderer({ data, width, height }: NodeProps<CanvasNode>) {
  const textColor = getNodeTextColor(data.color)

  return (
    <div
      className="group flex h-full w-full items-center justify-center rounded-xl border border-surface-border px-3 text-center text-sm font-medium"
      style={{ width, height, backgroundColor: data.color, color: textColor }}
    >
      {data.label}
      <Handle
        type="target"
        position={Position.Top}
        className="opacity-0 transition-opacity group-hover:opacity-100"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="opacity-0 transition-opacity group-hover:opacity-100"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="opacity-0 transition-opacity group-hover:opacity-100"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="opacity-0 transition-opacity group-hover:opacity-100"
      />
    </div>
  )
}

export { CanvasNodeRenderer }
