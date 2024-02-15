import { IPostProblem, IPostProblemPayload } from '@/components/course-page/type'
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
}
export const postService = new PostService()
