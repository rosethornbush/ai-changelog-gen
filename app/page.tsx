import { FormCard } from "@/components/app/FormCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export default function Page() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-5xl flex-col gap-12 py-24 font-sans">
      <header className="flex flex-col gap-2">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Changelog Generator
        </h2>
        <p className="text-xl text-muted-foreground">
          Turn recent commits into release notes.
        </p>
      </header>
      <FormCard />
    </main>
  )
}
