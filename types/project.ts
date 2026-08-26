type ProjectRole = "owner" | "collaborator"

interface Project {
  id: string
  name: string
  slug: string
  role: ProjectRole
}

export type { Project, ProjectRole }
