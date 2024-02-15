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
}

export const pullRequestService = new PullRequestService()
