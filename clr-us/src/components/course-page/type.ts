import { ProblemStatus, ProblemType } from '@/enum'

export interface IPostProblem {
  author: string
  title: string
  body: string
  solution: string
}

export interface IPREdit {
  author: string
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

export interface IImportedCLRSProblem {
  body: string
  title: string
}

export interface IPostCLRSProblem {
  chapter: number
  problem: number
  solution: string
  userId: string
  offeringId: string
}
