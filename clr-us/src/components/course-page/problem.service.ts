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

  getProblem = (uuid: string, setProblem: (problem: Problem) => void) =>
    axios
      .get(`/Problem/${uuid}`)
      .then((res) => setProblem(res.data))
      .catch((err) => err)

  getLatest = (uuid: string, setLatest: (problem: Problem) => void) =>
    axios
      .get(`/Problem/latest/${uuid}`)
      .then((res) => setLatest(res.data))
      .catch((err) => err)

  approveProblem = (uuid: string) =>
    axios
      .patch(`/Problem/status/${uuid}/${ProblemStatus.Posted}`)
      .then((res) => res.data)
      .catch((err) => err)

  endorseProblem = (uuid: string) =>
    axios
      .patch(`/Problem/status/${uuid}/${ProblemStatus.Endorsed}`)
      .then((res) => res.data)
      .catch((err) => err)

  deleteProblem = (uuid: string) =>
    axios
      .delete(`/Problem/${uuid}`)
      .then((res) => res.data)
      .catch((err) => err)

  getSolutionAuthors = (problemUuid: string) =>
    axios
      .get(`/Problem/authors/${problemUuid}`)
      .then((res) => res.data)
      .catch((err) => err)
}
export const problemService = new ProblemService()
