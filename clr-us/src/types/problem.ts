export const isProblem = (problem: unknown): problem is Problem => {
  if (!problem || typeof problem !== 'object') {
    return false
  }
  const requiredKeys = ['id', 'status', 'title', 'body', 'solution', 'type', 'author']
  if (requiredKeys.some((key) => !Object.hasOwn(problem, key))) {
    return false
  }
  return true
}

export enum ProblemStatus {
  Posted = 'Posted',
  Review = 'Review',
  Endorsed = 'Endorsed',
}

export type Problem = {
  id: string
  status: string
  title: string
  body: string
  solution: string
  type: string
  author: string
  [key: string]: string
}
