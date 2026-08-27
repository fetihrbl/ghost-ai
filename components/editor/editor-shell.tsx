"use client"

import { useState } from "react"

import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { EditorHome } from "@/components/editor/editor-home"
import { EditorWorkspace } from "@/components/editor/editor-workspace"
import { ProjectDialogs } from "@/components/editor/project-dialogs"
import { useProjectActions } from "@/hooks/use-project-actions"
import type { Project } from "@/types/project"

interface EditorShellProps {
  ownedProjects: Project[]
  sharedProjects: Project[]
  activeProject?: Project | null
}

function EditorShell({
  ownedProjects,
  sharedProjects,
  activeProject = null,
}: EditorShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const actions = useProjectActions({ activeProjectId: activeProject?.id })

  return (
    <div className="flex h-full min-h-screen flex-col bg-base">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />
      <div className="relative flex-1 overflow-hidden">
        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          myProjects={ownedProjects}
          sharedProjects={sharedProjects}
          onNewProject={actions.openCreateDialog}
          onRenameProject={actions.openRenameDialog}
          onDeleteProject={actions.openDeleteDialog}
        />
        {activeProject ? (
          <EditorWorkspace project={activeProject} />
        ) : (
          <EditorHome onNewProject={actions.openCreateDialog} />
        )}
      </div>
      <ProjectDialogs actions={actions} />
    </div>
  )
}

export { EditorShell }
