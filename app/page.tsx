import { ChangelogGenerator } from "@/components/app/ChangelogGenerator"

export default function Page() {
  return (
    <>
      <header className="flex flex-col gap-2">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Changelog Generator
        </h2>
        <p className="text-xl text-muted-foreground">
          Turn recent commits into release notes.
        </p>
      </header>
      <ChangelogGenerator />
    </>
  )
}
