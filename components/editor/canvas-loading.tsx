import { Loader2 } from "lucide-react"

function CanvasLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center gap-2 bg-base text-sm text-copy-muted">
      <Loader2 className="h-4 w-4 animate-spin" />
      Loading canvas…
    </div>
  )
}

export { CanvasLoading }
