import type { NodeShape } from "@/types/canvas"

interface ShapeVisualProps {
  shape: NodeShape
  fill: string
  selected?: boolean
}

function ShapeVisual({ shape, fill, selected = false }: ShapeVisualProps) {
  const strokeWidth = selected ? 2 : 1
  const borderClassName = selected ? "border-brand" : "border-surface-border"
  const strokeClassName = selected ? "stroke-brand" : "stroke-surface-border"

  if (shape === "rectangle" || shape === "pill" || shape === "circle") {
    const radiusClassName = shape === "rectangle" ? "rounded-xl" : "rounded-full"

    return (
      <div
        className={`h-full w-full border-solid ${radiusClassName} ${borderClassName}`}
        style={{ backgroundColor: fill, borderWidth: strokeWidth }}
      />
    )
  }

  return (
    <svg
      className="h-full w-full overflow-visible"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {shape === "diamond" && (
        <polygon
          points="50,2 98,50 50,98 2,50"
          fill={fill}
          className={strokeClassName}
          strokeWidth={strokeWidth}
          vectorEffect="non-scaling-stroke"
        />
      )}
      {shape === "hexagon" && (
        <polygon
          points="25,4 75,4 97,50 75,96 25,96 3,50"
          fill={fill}
          className={strokeClassName}
          strokeWidth={strokeWidth}
          vectorEffect="non-scaling-stroke"
        />
      )}
      {shape === "cylinder" && (
        <>
          <path
            d="M2,18 C2,9.7 24.4,3 50,3 C75.6,3 98,9.7 98,18 L98,82 C98,90.3 75.6,97 50,97 C24.4,97 2,90.3 2,82 Z"
            fill={fill}
            className={strokeClassName}
            strokeWidth={strokeWidth}
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M2,18 C2,26.3 24.4,33 50,33 C75.6,33 98,26.3 98,18"
            fill="none"
            className={strokeClassName}
            strokeWidth={strokeWidth}
            vectorEffect="non-scaling-stroke"
          />
        </>
      )}
    </svg>
  )
}

export { ShapeVisual }
