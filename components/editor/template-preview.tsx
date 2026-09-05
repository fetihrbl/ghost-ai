import { ShapeVisual } from "@/components/editor/shape-visual"
import type { CanvasTemplate } from "@/components/editor/starter-templates"
import { DEFAULT_EDGE_COLOR } from "@/types/canvas"
import type { CanvasNode } from "@/types/canvas"

const PREVIEW_WIDTH = 240
const PREVIEW_HEIGHT = 140
const PREVIEW_PADDING = 16

interface TemplatePreviewProps {
  template: CanvasTemplate
}

function TemplatePreview({ template }: TemplatePreviewProps) {
  const { nodes, edges } = template

  const minX = Math.min(...nodes.map((node) => node.position.x))
  const minY = Math.min(...nodes.map((node) => node.position.y))
  const maxX = Math.max(...nodes.map((node) => node.position.x + (node.width ?? 0)))
  const maxY = Math.max(...nodes.map((node) => node.position.y + (node.height ?? 0)))

  const boundsWidth = Math.max(maxX - minX, 1)
  const boundsHeight = Math.max(maxY - minY, 1)

  const availableWidth = PREVIEW_WIDTH - PREVIEW_PADDING * 2
  const availableHeight = PREVIEW_HEIGHT - PREVIEW_PADDING * 2
  const scale = Math.min(availableWidth / boundsWidth, availableHeight / boundsHeight, 1)

  const offsetX = (PREVIEW_WIDTH - boundsWidth * scale) / 2
  const offsetY = (PREVIEW_HEIGHT - boundsHeight * scale) / 2

  function toPreviewPoint(x: number, y: number) {
    return {
      x: offsetX + (x - minX) * scale,
      y: offsetY + (y - minY) * scale,
    }
  }

  function nodeCenter(node: CanvasNode) {
    return toPreviewPoint(
      node.position.x + (node.width ?? 0) / 2,
      node.position.y + (node.height ?? 0) / 2
    )
  }

  const nodeById = new Map(nodes.map((node) => [node.id, node]))

  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-xl border border-surface-border bg-base"
      style={{ width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT }}
    >
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        {edges.map((edge) => {
          const source = nodeById.get(edge.source)
          const target = nodeById.get(edge.target)
          if (!source || !target) return null

          const from = nodeCenter(source)
          const to = nodeCenter(target)

          return (
            <line
              key={edge.id}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={DEFAULT_EDGE_COLOR}
              strokeWidth={1}
              opacity={0.5}
            />
          )
        })}
      </svg>
      {nodes.map((node) => {
        const position = toPreviewPoint(node.position.x, node.position.y)

        return (
          <div
            key={node.id}
            className="absolute"
            style={{
              left: position.x,
              top: position.y,
              width: (node.width ?? 0) * scale,
              height: (node.height ?? 0) * scale,
            }}
          >
            <ShapeVisual shape={node.data.shape} fill={node.data.color} />
          </div>
        )
      })}
    </div>
  )
}

export { TemplatePreview }
