import { Octokit } from '@octokit/rest'

export const github = new Octokit({
  auth: process.env.GH_AUTH_TOKEN
})
