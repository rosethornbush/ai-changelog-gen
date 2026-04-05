export function parseRepo(repo: string) {
  return repo.startsWith("https://github.com/") ? repo.replace("https://github.com/", "") : repo
}
