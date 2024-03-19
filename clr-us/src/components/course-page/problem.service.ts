import { NavigateFunction } from 'react-router-dom'

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

  approveProblem = (navigate: NavigateFunction, uuid: string) => () =>
    axios
      .patch(`/Problem/status/${uuid}/${ProblemStatus.Posted}`)
      .then(() => navigate('..'))
      .catch((err) => err)

  endorseProblem = (navigate: NavigateFunction, uuid: string) => () =>
    axios
      .patch(`/Problem/status/${uuid}/${ProblemStatus.Endorsed}`)
      .then(() => navigate('..'))
      .catch((err) => err)

  deleteProblem = (navigate: NavigateFunction, uuid: string) => () =>
    axios
      .delete(`/Problem/${uuid}`)
      .then(() => navigate('..'))
      .catch((err) => err)
}
export const problemService = new ProblemService()
