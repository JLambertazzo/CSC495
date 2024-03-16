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

  getProblem = (id: string, setProblem: (problem: Problem) => void) =>
    axios
      .get(`/Problem/${id}`)
      .then((res) => setProblem(res.data))
      .catch((err) => err)

  getLatest = (id: string, setLatest: (problem: Problem) => void) =>
    axios
      .get(`/Problem/latest/${id}`)
      .then((res) => setLatest(res.data))
      .catch((err) => err)

  approveProblem = (navigate: NavigateFunction, id: string) => () =>
    axios
      .patch(`/Problem/status/${id}/${ProblemStatus.Posted}`)
      .then(() => navigate('..'))
      .catch((err) => err)

  endorseProblem = (navigate: NavigateFunction, id: string) => () =>
    axios
      .patch(`/Problem/status/${id}/${ProblemStatus.Endorsed}`)
      .then(() => navigate('..'))
      .catch((err) => err)

  deleteProblem = (navigate: NavigateFunction, id: string) => () =>
    axios
      .delete(`/Problem/${id}`)
      .then(() => navigate('..'))
      .catch((err) => err)
}
export const problemService = new ProblemService()
