import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

function EditorDialogContent({
  className,
  ...props
}: ComponentProps<typeof DialogContent>) {
  return (
    <DialogContent
      className={cn(
        "rounded-3xl border border-surface-border bg-surface p-6 text-copy-primary",
        className
      )}
      {...props}
    />
  )
}

function EditorDialogFooter({
  className,
  ...props
}: ComponentProps<typeof DialogFooter>) {
  return (
    <DialogFooter
      className={cn(
        "-mx-6 -mb-6 rounded-b-3xl border-surface-border bg-elevated/50 p-6",
        className
      )}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  EditorDialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  EditorDialogFooter,
}
