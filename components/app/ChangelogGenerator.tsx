"use client"

import { getDaysAgo } from "@/lib/getDaysAgo"
import { useForm } from "@tanstack/react-form"
import { z } from "zod"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { Button } from "../ui/button"
import {
  ArrowRightIcon,
  ArrowSquareOutIcon,
  ClipboardTextIcon,
  ExportIcon,
  FloppyDiskIcon,
  GithubLogoIcon,
  PencilLineIcon,
  SparkleIcon,
} from "@phosphor-icons/react/dist/ssr"
import { Suspense, useCallback, useId, useMemo, useState } from "react"
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Calendar } from "../ui/calendar"
import { Separator } from "../ui/separator"
import { ButtonGroup } from "../ui/button-group"
import { Skeleton } from "../ui/skeleton"
import { useMutation } from "@tanstack/react-query"
import { MDXContent } from "./MDXContent"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"
import { changelogs } from "@/lib/db/schema"
import { toast } from "sonner"
import { ChatAssistantMessage } from "@openrouter/sdk/models"
import { Badge } from "../ui/badge"
import Link from "next/link"
import { parseRepo } from "@/lib/parseRepo"

const DateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "2-digit",
  day: "2-digit",
})

const formSchema = z.object({
  repo: z.string().nonempty(),
  dates: z
    .object({
      from: z.date({ error: "Start date is required" }),
      to: z.date({ error: "End date is required" }),
    })
    .refine((data) => data.to > data.from, {
      error: "End date must be after start date",
      path: ["to"],
    }),
})

export function ChangelogGenerator() {
  const TODAY = useMemo(() => new Date(), [])

  const [changelog, setChangelog] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [changelogId, setChangelogId] = useState<string | null>(null)

  const generateMutation = useMutation<
    ChatAssistantMessage,
    Error,
    z.infer<typeof formSchema>
  >({
    mutationFn: async ({ repo, dates }) => {
      setChangelog(null)
      setChangelogId(null)

      const r = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({
          repo: parseRepo(repo),
          ...dates,
        }),
      })
      const json = await r.json()
      if (!r.ok) throw new Error(json.error ?? "Failed to generate changelog")
      return json
    },
    onSuccess: ({ content }) => {
      setChangelog(content)
    },
  })

  const form = useForm({
    defaultValues: {
      repo: "",
      dates: {
        from: getDaysAgo(7, TODAY),
        to: TODAY,
      },
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value: data }) => {
      await generateMutation.mutateAsync(data)
    },
  })
  const formId = useId()

  const editMutation = useMutation<
    typeof changelogs.$inferSelect,
    Error,
    Partial<typeof changelogs.$inferInsert>
  >({
    mutationFn: ({ id, content, repo }) => {
      return fetch("/api/publish", {
        method: "POST",
        body: JSON.stringify({
          id,
          content,
          repo: parseRepo(repo!),
        }),
      }).then((r) => r.json())
    },
    onSuccess: ({ id, content }) => {
      setChangelogId(id)
      setChangelog(content)
      toast("Published Changelog!")
    },
  })

  const copy = useCallback(() => {
    toast.promise(() => navigator.clipboard.writeText(changelog!), {
      success: "Copied to clipboard.",
      error: "Failed to copy to clipboard!",
    })
  }, [changelog])

  return (
    <>
      <section>
        <Card>
          <CardContent>
            <form
              id={formId}
              onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
              }}
            >
              <FieldGroup className="flex-row">
                <form.Field name="repo">
                  {(field) => {
                    const isInvalid =
                      (field.state.meta.isTouched &&
                        !field.state.meta.isValid) ||
                      generateMutation.isError
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          GitHub Repository
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => {
                              field.handleChange(e.target.value)
                              generateMutation.reset()
                            }}
                            aria-invalid={isInvalid}
                            placeholder="vercel/next.js"
                            autoComplete="off"
                          />
                          <InputGroupAddon>
                            <GithubLogoIcon weight="duotone" />
                          </InputGroupAddon>
                        </InputGroup>
                        {field.state.meta.isTouched &&
                          !field.state.meta.isValid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        {generateMutation.isError && (
                          <FieldError
                            errors={[
                              { message: generateMutation.error.message },
                            ]}
                          />
                        )}
                      </Field>
                    )
                  }}
                </form.Field>
                <Popover>
                  <PopoverTrigger
                    nativeButton={false}
                    render={<div role="button" />}
                  >
                    <Field>
                      <FieldLabel>Date Range</FieldLabel>
                      <Button variant="secondary" className="px-4">
                        <form.Subscribe
                          selector={(state) => state.values.dates.from}
                        >
                          {(value) => DateFormatter.format(value)}
                        </form.Subscribe>
                        <ArrowRightIcon weight="bold" />
                        <form.Subscribe
                          selector={(state) => state.values.dates.to}
                        >
                          {(value) => DateFormatter.format(value)}
                        </form.Subscribe>
                      </Button>
                    </Field>
                  </PopoverTrigger>
                  <PopoverContent
                    align="center"
                    sideOffset={8}
                    className="w-max p-0"
                  >
                    <div className="flex gap-2 rounded-lg border pr-2">
                      <form.Subscribe selector={(state) => state.values.dates}>
                        {(dates) => (
                          <Calendar
                            mode="range"
                            resetOnSelect
                            defaultMonth={TODAY}
                            selected={dates}
                            disabled={{ after: TODAY }}
                            onSelect={(selected) => {
                              if (selected?.from) {
                                form.setFieldValue("dates.from", selected.from)
                              }
                              if (selected?.to) {
                                form.setFieldValue("dates.to", selected.to)
                              }
                            }}
                          />
                        )}
                      </form.Subscribe>
                      <Separator orientation="vertical" />
                      <ButtonGroup orientation="vertical" className="mt-2">
                        {[
                          { label: "Today", value: 0 },
                          { label: "Yesterday", value: 1 },
                          { label: "Past 3 Days", value: 3 },
                          { label: "Past Week", value: 7 },
                          { label: "Past Two Weeks", value: 14 },
                          { label: "Past Month", value: 30 },
                        ].map((preset) => (
                          <Button
                            key={preset.value}
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              form.setFieldValue("dates", {
                                from: getDaysAgo(preset.value, TODAY),
                                to: TODAY,
                              })
                            }}
                          >
                            {preset.label}
                          </Button>
                        ))}
                      </ButtonGroup>
                    </div>
                  </PopoverContent>
                </Popover>
              </FieldGroup>
            </form>
          </CardContent>
          <CardFooter>
            <Button
              form={formId}
              type="submit"
              size="lg"
              className="w-full"
              disabled={generateMutation.isPending}
            >
              <SparkleIcon weight="duotone" />
              <span>
                {generateMutation.isPending
                  ? "Generating..."
                  : "Generate Changelog"}
              </span>
            </Button>
          </CardFooter>
        </Card>
      </section>
      <section>
        <Card>
          <CardHeader>
            <div className="grid grid-cols-[auto_1fr_auto] place-items-center">
              <CardTitle className="col-span-full row-start-1 flex items-center gap-2">
                <span>Live Preview</span>
                {changelog && (
                  <Badge
                    variant={
                      changelogId
                        ? "default"
                        : isEditing
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {changelogId
                      ? "Published"
                      : isEditing
                        ? "Editing"
                        : "Unpublished"}
                  </Badge>
                )}
              </CardTitle>
              <div className="col-start-1 row-start-1 flex gap-2">
                <i className="size-3 rounded-full bg-red-400" />
                <i className="size-3 rounded-full bg-yellow-400" />
                <i className="size-3 rounded-full bg-green-400" />
              </div>
              <CardAction>
                {changelog && (
                  <ButtonGroup>
                    {!changelogId && (
                      <Button
                        variant="secondary"
                        onClick={() => setIsEditing((prev) => !prev)}
                      >
                        {isEditing ? (
                          <FloppyDiskIcon weight="duotone" />
                        ) : (
                          <PencilLineIcon weight="duotone" />
                        )}
                        <span>{isEditing ? "Save" : "Edit"}</span>
                      </Button>
                    )}
                    {!isEditing && (
                      <>
                        <Button variant="secondary" onClick={() => copy()}>
                          <ClipboardTextIcon weight="duotone" />
                          <span>Copy</span>
                        </Button>
                        {changelogId ? (
                          <Button
                            nativeButton={false}
                            render={
                              <Link
                                href={`/${changelogId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              />
                            }
                          >
                            <ArrowSquareOutIcon weight="duotone" />
                            <span>View Changelog</span>
                          </Button>
                        ) : (
                          <form.Subscribe selector={(data) => data.values.repo}>
                            {(repo) => (
                              <Button
                                onClick={() =>
                                  editMutation.mutate({
                                    repo,
                                    content: changelog,
                                  })
                                }
                              >
                                <ExportIcon weight="duotone" />
                                <span>Publish</span>
                              </Button>
                            )}
                          </form.Subscribe>
                        )}
                      </>
                    )}
                  </ButtonGroup>
                )}
              </CardAction>
            </div>
          </CardHeader>
          <CardContent>
            {changelog ? (
              <ScrollArea className="max-h-192 overflow-y-scroll">
                {isEditing ? (
                  <textarea
                    value={changelog}
                    onChange={(e) => setChangelog(e.target.value)}
                    className="h-128 w-full resize-none p-4 font-mono text-sm outline-none"
                  />
                ) : (
                  <Suspense fallback={<Skeleton className="h-128 w-full" />}>
                    <MDXContent source={changelog} />
                  </Suspense>
                )}
                <ScrollBar orientation="vertical" />
              </ScrollArea>
            ) : (
              <Skeleton className="h-128 w-full" />
            )}
          </CardContent>
        </Card>
      </section>
    </>
  )
}
