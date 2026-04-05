"use client"

import { evaluate } from "@mdx-js/mdx"
import { use, useMemo } from "react"
import * as runtime from "react/jsx-runtime"

export function MDXContent({ source }: { source: string }) {
  const promise = useMemo(() => evaluate(source, { ...runtime }), [source])
  const { default: Content } = use(promise)
  return (
    <section className="prose prose-base max-w-none dark:prose-invert">
      <Content />
    </section>
  )
}
