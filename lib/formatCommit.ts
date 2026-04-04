import type { Endpoints } from '@octokit/types'

export type CommitData = Endpoints['GET /repos/{owner}/{repo}/commits/{ref}']['response']['data']

export function formatCommit(commit: CommitData) {
  const sha = commit.sha.slice(0, 7)
  const message = commit.commit.message.split('\n')[0]
  const files = commit.files ?? []

  const stats = files.length
    ? files
        .map(f => `    ${f.filename} (+${f.additions} -${f.deletions})`)
        .join('\n')
    : '    (no file stats available)'

  return `- ${sha}: ${message}\n${stats}`
}
