export interface IPostComment {
  commentOn: string
  author: string
  replyTo?: string
  body: string
}

export type Comment = {
  id: string
  replyTo?: string
  author: string
  body: string
}
