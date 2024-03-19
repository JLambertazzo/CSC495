import { axios } from '@/components/services/axios'

import { IPostComment, Comment } from './type'

class CommentService {
  getComments = (problemId: string) =>
    axios
      .get(`/Comment/${problemId}`)
      .then((res) => res.data.filter((el: Comment) => !el.replyTo))
      .catch((err) => err)

  getReplies = (commentId: string) =>
    axios
      .get(`/Comment/${commentId}/replies`)
      .then((res) => res.data)
      .catch((err) => err)

  postComment = (payload: IPostComment) =>
    axios
      .post(`/Comment`, payload)
      .then()
      .catch((err) => err)

  deleteComment = (commentId: string) =>
    axios
      .delete(`/Comment/${commentId}`)
      .then()
      .catch((err) => err)
}
export const commentService = new CommentService()
