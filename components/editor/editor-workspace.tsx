import type { Project } from "@/types/project"

interface EditorWorkspaceProps {
  project: Project
}

function EditorWorkspace({ project }: EditorWorkspaceProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
      <h1 className="text-lg font-medium text-copy-primary">{project.name}</h1>
      <p className="text-sm text-copy-muted">Canvas coming soon.</p>
    </div>
  )
}

export { EditorWorkspace }
