import { axios } from '@/components/services/axios'

import { IPostComment, Comment } from './type'

class CommentService {
  getComments = (problemUuid: string) =>
    axios
      .get(`/Comment/${problemUuid}`)
      .then((res) => res.data.filter((el: Comment) => !el.replyTo))
      .catch((err) => err)

  getReplies = (commentUuid: string) =>
    axios
      .get(`/Comment/${commentUuid}/replies`)
      .then((res) => res.data)
      .catch((err) => err)

  postComment = (payload: IPostComment) =>
    axios
      .post(`/Comment`, payload)
      .then()
      .catch((err) => err)

  deleteComment = (commentUuid: string) =>
    axios
      .delete(`/Comment/${commentUuid}`)
      .then()
      .catch((err) => err)
}
export const commentService = new CommentService()
