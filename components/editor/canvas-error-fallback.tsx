import { WifiOff } from "lucide-react"

function CanvasErrorFallback() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-base px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-elevated">
        <WifiOff className="h-6 w-6 text-state-error" />
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-medium text-copy-primary">
          Canvas connection error
        </h2>
        <p className="text-sm text-copy-muted">
          Couldn&apos;t connect to the collaborative canvas. Try refreshing
          the page.
        </p>
      </div>
    </div>
  )
}

export { CanvasErrorFallback }
