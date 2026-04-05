# ai changelog generator

paste a github repo, pick a date range, get a changelog. publish it and share the url.

## setup

```bash
cp .env.example .env.local
pnpm install
pnpm drizzle-kit push
pnpm dev
```

### env

| variable             | required | description                                  |
| -------------------- | -------- | -------------------------------------------- |
| `OPENROUTER_API_KEY` | yes      | from [openrouter.ai](https://openrouter.ai)  |
| `GH_AUTH_TOKEN`      | no       | github pat, helps with rate limits           |
| `TURSO_DATABASE_URL` | yes      | defaults to `file:local.db` for local sqlite |

## why these tools

**openrouter + gemma 4**: no vendor lock in, gemma 4 follows instructions well and outputs clean markdown.

**turso**: `file:local.db` just works locally, swap to hosted turso in prod without changing code.

**drizzle**: type safe, lightweight, migrations as code.

**mdx**: ai output renders as styled prose immediately, can override components for headings and code blocks.

## how it works

date presets (today, past 3/7/14/30 days) because "what shipped this week" is the common case.

you can edit the ai output before publishing because it's not always right.

publishing creates a shareable url at `/{id}`. the url is the deliverable, not a copy paste box.

public page shows the repo owner avatar and a link to github so readers know what they're looking at.

## ai tools used

claude helped write the prompts in `lib/ai.ts`.
