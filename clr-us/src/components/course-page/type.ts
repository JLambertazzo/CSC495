import { ProblemStatus, ProblemType } from '@/enum'

export interface IPostProblem {
  author: string
  title: string
  body: string
  solution: string
}

export interface IPostProblemPayload extends IPostProblem {
  source: string | null
  status: ProblemStatus
  class: string
  type: ProblemType
  version: number
  latest: boolean
}
