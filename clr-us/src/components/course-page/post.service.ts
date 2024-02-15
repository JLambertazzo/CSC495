import {
  IImportedCLRSProblem,
  IPostCLRSProblem,
  IPostProblem,
  IPostProblemPayload,
} from '@/components/course-page/type'
import { ProblemStatus, ProblemType } from '@/enum'

import { axios } from '../services/axios'

class PostService {
  postProblemScratch = (values: IPostProblem, oid: string, type: ProblemType): Promise<void> => {
    return axios
      .post('/Problem', {
        userId: values.author,
        offeringId: oid,
        problem: {
          ...values,
          source: null,
          status: ProblemStatus.Review,
          class: oid,
          type,
          version: 0,
          latest: true,
        } as IPostProblemPayload,
      })
      .then()
      .catch((err) => err)
  }

  postCLRSProblem = (values: IPostCLRSProblem): Promise<void> => {
    return axios
      .post('/Problem/clrs', values)
      .then()
      .catch((err) => err)
  }

  getCLRSProblem = (chapter: number, problem: number): Promise<IImportedCLRSProblem> => {
    return axios
      .get(`/CLRS/${chapter}/${problem}`)
      .then((res) => res.data)
      .catch((err) => err)
  }
}
export const postService = new PostService()
