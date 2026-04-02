"use client"

import { getDaysAgo } from "@/lib/getDaysAgo"
import { useForm } from "@tanstack/react-form"
import { z } from "zod"
import { Card, CardContent, CardFooter } from "../ui/card"
import { Button } from "../ui/button"
import {
  ArrowRightIcon,
  GithubLogoIcon,
  SparkleIcon,
} from "@phosphor-icons/react/dist/ssr"
import { useId, useMemo, useState } from "react"
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group"
import type { DateRange } from "react-day-picker"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Calendar } from "../ui/calendar"
import { Separator } from "../ui/separator"
import { ButtonGroup } from "../ui/button-group"

const DateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "2-digit",
  day: "2-digit",
})

const formSchema = z.object({
  repo: z.string(),
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

export function FormCard() {
  const TODAY = useMemo(() => new Date(), [])

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
  })
  const formId = useId()

  return (
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
                  field.state.meta.isTouched && !field.state.meta.isValid
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
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="vercel/next.js"
                        autoComplete="off"
                      />
                      <InputGroupAddon>
                        <GithubLogoIcon weight="duotone" />
                      </InputGroupAddon>
                    </InputGroup>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
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
                    <form.Subscribe selector={(state) => state.values.dates.to}>
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
                      { label: "3 Days Ago", value: 3 },
                      { label: "A Week Ago", value: 7 },
                      { label: "Two Weeks Ago", value: 14 },
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
        <Button type="submit" size="lg" className="w-full">
          <SparkleIcon weight="duotone" />
          <span>Generate Changelog</span>
        </Button>
      </CardFooter>
    </Card>
  )
}
