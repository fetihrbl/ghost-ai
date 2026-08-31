import type { Edge, Node } from "@xyflow/react"

interface NodeColor {
  fill: string
  text: string
}

const NODE_COLORS: readonly NodeColor[] = [
  { fill: "#1F1F1F", text: "#EDEDED" },
  { fill: "#10233D", text: "#52A8FF" },
  { fill: "#2E1938", text: "#BF7AF0" },
  { fill: "#331B00", text: "#FF990A" },
  { fill: "#3C1618", text: "#FF6166" },
  { fill: "#3A1726", text: "#F75F8F" },
  { fill: "#0F2E18", text: "#62C073" },
  { fill: "#062822", text: "#0AC7B4" },
] as const

const DEFAULT_NODE_COLOR = NODE_COLORS[0]

const NODE_SHAPES = [
  "rectangle",
  "diamond",
  "circle",
  "pill",
  "cylinder",
  "hexagon",
] as const

type NodeShape = (typeof NODE_SHAPES)[number]

interface ShapeSize {
  width: number
  height: number
}

const SHAPE_DEFAULT_SIZES: Record<NodeShape, ShapeSize> = {
  rectangle: { width: 160, height: 80 },
  diamond: { width: 180, height: 180 },
  circle: { width: 100, height: 100 },
  pill: { width: 160, height: 64 },
  cylinder: { width: 120, height: 110 },
  hexagon: { width: 170, height: 100 },
}

const SHAPE_DRAG_MIME_TYPE = "application/x-ghost-shape"

interface ShapeDragPayload {
  shape: NodeShape
  width: number
  height: number
}

function getNodeTextColor(fill: string): string {
  return NODE_COLORS.find((color) => color.fill === fill)?.text ?? DEFAULT_NODE_COLOR.text
}

interface CanvasNodeData {
  [key: string]: unknown
  label: string
  color: string
  shape: NodeShape
}

type CanvasNode = Node<CanvasNodeData, "canvasNode">
type CanvasEdge = Edge<Record<string, never>, "canvasEdge">

export {
  DEFAULT_NODE_COLOR,
  getNodeTextColor,
  NODE_COLORS,
  NODE_SHAPES,
  SHAPE_DEFAULT_SIZES,
  SHAPE_DRAG_MIME_TYPE,
}
export type {
  CanvasEdge,
  CanvasNode,
  CanvasNodeData,
  NodeColor,
  NodeShape,
  ShapeDragPayload,
  ShapeSize,
}
