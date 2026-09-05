"use client"

import type { CSSProperties } from "react"

import { NODE_COLORS } from "@/types/canvas"

interface NodeColorToolbarProps {
  activeColor: string
  onSelect: (color: string) => void
}

function NodeColorToolbar({ activeColor, onSelect }: NodeColorToolbarProps) {
  return (
    <div className="nodrag nopan nowheel absolute bottom-full left-1/2 z-10 mb-2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-surface-border bg-surface/90 px-2 py-1.5 shadow-lg backdrop-blur">
      {NODE_COLORS.map((color) => {
        const isActive = color.fill === activeColor

        return (
          <button
            key={color.fill}
            type="button"
            onClick={() => onSelect(color.fill)}
            aria-label={`Set node color to ${color.text}`}
            aria-pressed={isActive}
            style={
              {
                backgroundColor: color.fill,
                outline: `2px solid ${isActive ? color.text : "transparent"}`,
                outlineOffset: 2,
                "--glow-color": color.text,
              } as CSSProperties
            }
            className="h-5 w-5 shrink-0 rounded-full transition-[outline-color,box-shadow] hover:shadow-[0_0_6px_1.5px_var(--glow-color)]"
          />
        )
      })}
    </div>
  )
}

export { NodeColorToolbar }
