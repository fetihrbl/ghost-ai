"use client"

import { LayoutTemplate } from "lucide-react"

import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  EditorDialogContent,
} from "@/components/editor/editor-dialog"
import { CANVAS_TEMPLATES } from "@/components/editor/starter-templates"
import type { CanvasTemplate } from "@/components/editor/starter-templates"
import { TemplatePreview } from "@/components/editor/template-preview"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface StarterTemplatesModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (template: CanvasTemplate) => void
}

function StarterTemplatesModal({ isOpen, onClose, onImport }: StarterTemplatesModalProps) {
  function handleImport(template: CanvasTemplate) {
    onImport(template)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <EditorDialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Starter templates</DialogTitle>
          <DialogDescription>
            Import a prebuilt system design to start from. This replaces everything on the current
            canvas.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="grid grid-cols-1 gap-4 pr-3 sm:grid-cols-2">
            {CANVAS_TEMPLATES.map((template) => (
              <Card
                key={template.id}
                className="border border-surface-border bg-elevated"
              >
                <CardHeader>
                  <CardTitle>{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <TemplatePreview template={template} />
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleImport(template)}>
                    <LayoutTemplate className="h-4 w-4" />
                    Import
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </EditorDialogContent>
    </Dialog>
  )
}

export { StarterTemplatesModal }
