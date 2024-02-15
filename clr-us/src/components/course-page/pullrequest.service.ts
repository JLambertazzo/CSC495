import { PullRequest, isPullRequest } from '@/types'

import { axios } from '../services/axios'

class PullRequestService {
  postPullRequest = (problemId: string, body: string, author: string) => {
    return axios
      .post('/PullRequest', {
        problemId,
        body,
        author,
      })
      .then()
      .catch((err) => err)
  }

  getPullRequests = (problemId: string, setPrs: (prs: PullRequest[] | null) => void) =>
    axios
      .get(`/PullRequest/problem/${problemId}`)
      .then((res) => setPrs(res.data.filter(isPullRequest)))
      .catch((err) => err)

  upvote = (problemId: string) =>
    axios
      .post(`/PullRequest/upvote?id=${problemId}`)
      .then()
      .catch((err) => err)

  merge = (prId: string) =>
    axios
      .post(`/PullRequest/merge?id=${prId}`)
      .then()
      .catch((err) => err)
}

export const pullRequestService = new PullRequestService()
