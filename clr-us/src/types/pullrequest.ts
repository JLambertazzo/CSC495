export const isPullRequest = (pr: unknown): pr is PullRequest => {
  if (!pr || typeof pr !== 'object') {
    return false
  }
  const requiredKeys = ['id', 'problemUuid', 'upvoters', 'body', 'author']
  return requiredKeys.every((key) => Object.hasOwn(pr, key))
}

export type PullRequest = {
  id: string
  problemUuid: string
  upvoters: string[]
  body: string
  author: string
}
