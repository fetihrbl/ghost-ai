import { Lock } from "lucide-react"
import Link from "next/link"

function AccessDenied() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-base px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-elevated">
        <Lock className="h-6 w-6 text-copy-muted" />
      </div>
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-medium text-copy-primary">
          Access denied
        </h1>
        <p className="text-sm text-copy-muted">
          You don&apos;t have access to this project, or it doesn&apos;t
          exist.
        </p>
      </div>
      <Link href="/editor" className="text-sm font-medium text-brand hover:underline">
        Back to editor
      </Link>
    </div>
  )
}

export { AccessDenied }
