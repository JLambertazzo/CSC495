import { ProblemType } from '@/enum'
import { Problem, ProblemStatus, isProblem } from '@/types/problem'

import { axios } from '../services/axios'

class ProblemService {
  getProblems = (
    classId: string,
    status: ProblemStatus,
    problemType: ProblemType,
    setProblems: (problems: Problem[]) => void
  ): Promise<Problem[]> => {
    return axios
      .get(`/Problem/class/${classId}?status=${status}`)
      .then((res) => {
        if (res.status === 200 && Array.isArray(res.data) && res.data.every(isProblem)) {
          return setProblems(
            res.data.filter((problem) => problem.type.toLowerCase() === problemType.toLowerCase())
          )
        } else {
          return 'Error.'
        }
      })
      .catch((err) => err)
  }
}
export const problemService = new ProblemService()
