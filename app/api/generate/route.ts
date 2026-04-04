import { openrouter, systemPrompt, userPrompt } from "@/lib/ai"
import { github } from "@/lib/github"

export async function POST(req: Request) {
  const { repo, from, to } = await req.json()

  const [owner, repoName] = repo.split("/")

  const { data: commitList } = await github.repos.listCommits({
    owner,
    repo: repoName,
    since: from,
    until: to,
    per_page: 50
  })

  const commits = await Promise.all(commitList.map(c => github.repos.getCommit({ owner, repo: repoName, ref: c.sha }).then(r => r.data)))

  const message = await openrouter.chat.send({
    chatRequest: {
      model: "google/gemma-4-26b-a4b-it:nitro",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: await userPrompt({ repo, from, to, commits }) }
      ],
    }
  })

  return Response.json(message.choices[0].message)
}
