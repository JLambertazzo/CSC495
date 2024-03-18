export interface IPostComment {
  commentOn: string
  author: string
  replyTo: string | null
  body: string
  numReplies: number
}

export type Comment = {
  id: string
  commentOn: string
  replyTo: string | null
  author: string
  body: string
  numReplies: number
}
