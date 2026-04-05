import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <h2 className="text-2xl font-semibold">Changelog not found</h2>
      <p className="text-muted-foreground">
        This changelog doesn't exist or may have been deleted.
      </p>
      <Button nativeButton={false} render={<Link href="/" />}>
        Back to generator
      </Button>
    </div>
  )
}
