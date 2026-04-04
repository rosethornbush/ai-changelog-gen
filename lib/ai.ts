import { OpenRouter } from '@openrouter/sdk';
import { CommitData, formatCommit } from './formatCommit';

export const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY
})

export const systemPrompt = `You are a technical writer that specializes in developer-facing release notes.
You write clearly and specifically — never pad output with filler phrases like "this release includes exciting new improvements."
You return clean markdown only. No commentary, no preamble, just the markdown.`

export async function userPrompt({ repo, from, to, commits }: { repo: string, from: Date, to: Date, commits: CommitData[] }) {
  return `Generate a changelog entry for ${repo} covering ${from} to ${to}.

Commits:
${commits.map(formatCommit).join('\n')}

Use this structure:
# v{version} — {punchy title}

{1-2 sentence prose summary}

## Features
- ...

## Fixes
- ...

## Breaking Changes
- ...

## Internal
- ...

Rules:
- Only include sections that have relevant commits
- Skip merge commits, version bumps, typo fixes unless significant
- Use file stats to write specific bullets — mention flag names, function names, affected areas
- Write for developers reading a public changelog`
}
