"use client"

import { useState } from "react"

import { AiSidebar } from "@/components/editor/ai-sidebar"
import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { EditorHome } from "@/components/editor/editor-home"
import { EditorWorkspace } from "@/components/editor/editor-workspace"
import { ProjectDialogs } from "@/components/editor/project-dialogs"
import { ShareDialog } from "@/components/editor/share-dialog"
import { useProjectActions } from "@/hooks/use-project-actions"
import type { Project } from "@/types/project"

interface EditorShellProps {
  ownedProjects: Project[]
  sharedProjects: Project[]
  activeProject?: Project | null
  isOwner?: boolean
}

function EditorShell({
  ownedProjects,
  sharedProjects,
  activeProject = null,
  isOwner = false,
}: EditorShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const actions = useProjectActions({ activeProjectId: activeProject?.id })

  return (
    <div className="flex h-full min-h-screen flex-col bg-base">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
        projectName={activeProject?.name}
        isAiSidebarOpen={isAiSidebarOpen}
        onToggleAiSidebar={
          activeProject
            ? () => setIsAiSidebarOpen((open) => !open)
            : undefined
        }
        onShare={activeProject ? () => setIsShareDialogOpen(true) : undefined}
      />
      <div className="relative flex-1">
        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          myProjects={ownedProjects}
          sharedProjects={sharedProjects}
          activeProjectId={activeProject?.id}
          onNewProject={actions.openCreateDialog}
          onRenameProject={actions.openRenameDialog}
          onDeleteProject={actions.openDeleteDialog}
        />
        {activeProject ? (
          <EditorWorkspace project={activeProject} />
        ) : (
          <EditorHome onNewProject={actions.openCreateDialog} />
        )}
        {activeProject ? (
          <AiSidebar
            isOpen={isAiSidebarOpen}
            onClose={() => setIsAiSidebarOpen(false)}
          />
        ) : null}
      </div>
      <ProjectDialogs actions={actions} />
      {activeProject ? (
        <ShareDialog
          isOpen={isShareDialogOpen}
          onClose={() => setIsShareDialogOpen(false)}
          projectId={activeProject.id}
          isOwner={isOwner}
        />
      ) : null}
    </div>
  )
}

export { EditorShell }
