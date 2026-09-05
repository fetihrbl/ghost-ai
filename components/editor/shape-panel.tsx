"use client"

import { Circle, Cylinder, Diamond, Hexagon, Pill, RectangleHorizontal } from "lucide-react"
import { useRef } from "react"
import type { ComponentType, DragEvent } from "react"

import { ShapeVisual } from "@/components/editor/shape-visual"
import {
  DEFAULT_NODE_COLOR,
  NODE_SHAPES,
  SHAPE_DEFAULT_SIZES,
  SHAPE_DRAG_MIME_TYPE,
} from "@/types/canvas"
import type { NodeShape, ShapeDragPayload } from "@/types/canvas"

const SHAPE_ICONS: Record<NodeShape, ComponentType<{ className?: string }>> = {
  rectangle: RectangleHorizontal,
  diamond: Diamond,
  circle: Circle,
  pill: Pill,
  cylinder: Cylinder,
  hexagon: Hexagon,
}

const SHAPE_LABELS: Record<NodeShape, string> = {
  rectangle: "Rectangle",
  diamond: "Diamond",
  circle: "Circle",
  pill: "Pill",
  cylinder: "Cylinder",
  hexagon: "Hexagon",
}

function ShapePanel() {
  const previewRefs = useRef<Partial<Record<NodeShape, HTMLDivElement | null>>>({})

  function handleDragStart(event: DragEvent<HTMLButtonElement>, shape: NodeShape) {
    const { width, height } = SHAPE_DEFAULT_SIZES[shape]
    const payload: ShapeDragPayload = { shape, width, height }

    event.dataTransfer.setData(SHAPE_DRAG_MIME_TYPE, JSON.stringify(payload))
    event.dataTransfer.effectAllowed = "copy"

    const preview = previewRefs.current[shape]
    if (preview) {
      event.dataTransfer.setDragImage(preview, width / 2, height / 2)
    }
  }

  return (
    <>
      {/* Off-screen shape previews used as native drag ghost images via setDragImage. */}
      <div className="pointer-events-none fixed left-[-9999px] top-[-9999px]" aria-hidden>
        {NODE_SHAPES.map((shape) => {
          const { width, height } = SHAPE_DEFAULT_SIZES[shape]

          return (
            <div
              key={shape}
              ref={(el) => {
                previewRefs.current[shape] = el
              }}
              style={{ width, height }}
            >
              <ShapeVisual shape={shape} fill={DEFAULT_NODE_COLOR.fill} />
            </div>
          )
        })}
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full border border-surface-border bg-surface/90 p-2 shadow-lg backdrop-blur">
        {NODE_SHAPES.map((shape) => {
          const Icon = SHAPE_ICONS[shape]

          return (
            <button
              key={shape}
              type="button"
              draggable
              onDragStart={(event) => handleDragStart(event, shape)}
              title={SHAPE_LABELS[shape]}
              aria-label={`Drag to add a ${SHAPE_LABELS[shape]} node`}
              className="flex h-10 w-10 cursor-grab items-center justify-center rounded-full text-copy-secondary transition-colors hover:bg-elevated hover:text-copy-primary active:cursor-grabbing"
            >
              <Icon className="h-5 w-5" />
            </button>
          )
        })}
      </div>
    </>
  )
}

export { ShapePanel }
