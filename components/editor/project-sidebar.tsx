"use client"

import { Pencil, Plus, Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { Project } from "@/types/project"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
  myProjects: Project[]
  sharedProjects: Project[]
  onNewProject: () => void
  onRenameProject: (project: Project) => void
  onDeleteProject: (project: Project) => void
}

function ProjectSidebar({
  isOpen,
  onClose,
  myProjects,
  sharedProjects,
  onNewProject,
  onRenameProject,
  onDeleteProject,
}: ProjectSidebarProps) {
  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          "fixed inset-0 top-14 z-30 bg-black/50 transition-opacity duration-200 ease-out lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />
      <aside
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={cn(
          "fixed top-14 bottom-0 left-0 z-40 flex w-80 -translate-x-full flex-col border-r border-surface-border bg-surface/95 backdrop-blur-xl transition-transform duration-200 ease-out",
          isOpen && "translate-x-0"
        )}
      >
        <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
          <h2 className="text-sm font-medium text-copy-primary">Projects</h2>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Tabs
          defaultValue="my-projects"
          className="min-h-0 flex-1 gap-0 px-4 pt-3"
        >
          <TabsList className="w-full">
            <TabsTrigger value="my-projects" className="flex-1">
              My Projects
            </TabsTrigger>
            <TabsTrigger value="shared" className="flex-1">
              Shared
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="my-projects"
            className="min-h-0 overflow-y-auto"
          >
            {myProjects.length === 0 ? (
              <div className="flex h-40 items-center justify-center text-sm text-copy-muted">
                No projects yet
              </div>
            ) : (
              <ul className="flex flex-col gap-0.5 py-2">
                {myProjects.map((project) => (
                  <li
                    key={project.id}
                    className="group flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 hover:bg-elevated"
                  >
                    <span className="truncate text-sm text-copy-primary">
                      {project.name}
                    </span>
                    <div className="flex shrink-0 items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        aria-label={`Rename ${project.name}`}
                        onClick={() => onRenameProject(project)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        aria-label={`Delete ${project.name}`}
                        onClick={() => onDeleteProject(project)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>
          <TabsContent value="shared" className="min-h-0 overflow-y-auto">
            {sharedProjects.length === 0 ? (
              <div className="flex h-40 items-center justify-center text-sm text-copy-muted">
                No shared projects yet
              </div>
            ) : (
              <ul className="flex flex-col gap-0.5 py-2">
                {sharedProjects.map((project) => (
                  <li
                    key={project.id}
                    className="truncate rounded-lg px-2 py-1.5 text-sm text-copy-primary"
                  >
                    {project.name}
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>
        </Tabs>

        <div className="border-t border-surface-border p-4">
          <Button className="w-full" onClick={onNewProject}>
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </aside>
    </>
  )
}

export { ProjectSidebar }
