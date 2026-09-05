import { Ghost } from "lucide-react"
import type { ReactNode } from "react"

interface AuthLayoutProps {
  children: ReactNode
}

const FEATURES = [
  "Describe a system in plain English",
  "Collaborate on a shared canvas in real time",
  "Generate a technical spec from your architecture",
]

function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-base">
      <div className="hidden w-1/2 flex-col justify-center gap-8 border-r border-surface-border px-16 lg:flex">
        <div className="flex items-center gap-2">
          <Ghost className="h-6 w-6 text-brand" />
          <span className="text-lg font-semibold text-copy-primary">
            Ghost AI
          </span>
        </div>
        <p className="max-w-sm text-copy-secondary">
          A real-time collaborative system design workspace.
        </p>
        <ul className="space-y-3 text-sm text-copy-muted">
          {FEATURES.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </div>
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        {children}
      </div>
    </div>
  )
}

export { AuthLayout }
