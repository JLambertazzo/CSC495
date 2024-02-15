export const isPullRequest = (pr: unknown): pr is PullRequest => {
  if (!pr || typeof pr !== 'object') {
    return false
  }
  const requiredKeys = ['id', 'problemId', 'upvotes', 'body', 'author']
  return requiredKeys.every((key) => Object.hasOwn(pr, key))
}

export type PullRequest = {
  id: string
  problemId: string
  upvotes: number
  body: string
  author: string
}
