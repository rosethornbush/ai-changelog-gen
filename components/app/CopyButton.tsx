"use client"

import { toast } from "sonner"
import { Button } from "../ui/button"
import { ClipboardIcon } from "@phosphor-icons/react/dist/ssr"

export function CopyButton({ content }: { content: string }) {
  return (
    <Button
      variant="secondary"
      onClick={() => {
        toast.promise(() => navigator.clipboard.writeText(content), {
          success: "Copied to clipboard.",
          error: "Failed to copy to clipboard!",
        })
      }}
    >
      <ClipboardIcon weight="duotone" />
      <span>Copy Markdown</span>
    </Button>
  )
}
