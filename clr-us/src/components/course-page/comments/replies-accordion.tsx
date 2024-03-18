import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from '@mui/material'
import React, { useCallback, useState } from 'react'

import { CommentCard } from '@/components/course-page/comments/comment-card'
import { commentService } from '@/components/course-page/comments/comment.service'
import { useNotification } from '@/hooks/useNotification'

import { Comment } from './type'

export const RepliesAccordion: React.FC<{
  originalCommentId: string
  numReplies: number
  fetchComments: () => Promise<void>
}> = ({ originalCommentId, numReplies, fetchComments }) => {
  const [replies, setReplies] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const notify = useNotification()

  const fetchReplies = useCallback(() => {
    setIsLoading(true)
    return commentService.getReplies(originalCommentId).then((res) => {
      setReplies(res)
      setIsLoading(false)
    })
  }, [originalCommentId])

  const handleDeleteComment = useCallback(
    async (commentId: string) => {
      await commentService.deleteComment(commentId).then(() => {
        fetchComments().then()
        fetchReplies().then()
        notify({
          message: 'Success! Your comment was deleted.',
          severity: 'success',
        })
      })
    },
    [fetchComments, fetchReplies, notify]
  )

  return (
    <Accordion
      elevation={0}
      onChange={(e, expanded) => {
        if (expanded) fetchReplies().then()
      }}
      sx={{
        background: 'none',
        border: 'none',
        '&::before': {
          display: 'none',
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <Typography color={'#022D6D'} variant={'subtitle1'} fontWeight={600}>
          {numReplies} {numReplies === 1 ? 'reply' : 'replies'}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <>
            {replies.map((comment, index) => (
              <Grid container gap={2} marginTop={2} direction="column" key={comment.id}>
                <CommentCard
                  {...comment}
                  handleDelete={handleDeleteComment}
                  problemId={comment.commentOn}
                  fetchComments={fetchReplies}
                />
                {index < replies.length - 1 && <Divider />}
              </Grid>
            ))}
          </>
        )}
      </AccordionDetails>
    </Accordion>
  )
}
