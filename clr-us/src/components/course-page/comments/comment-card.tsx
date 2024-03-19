import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from '@mui/material'
import parse from 'html-react-parser'
import React, { useMemo } from 'react'

import { UserAvatar } from '@/components/avatar/user-avatar'
import { RepliesAccordion } from '@/components/course-page/comments/replies-accordion'
import { ReplyButton } from '@/components/course-page/comments/reply-button'
import useAuth from '@/context/context'
import { useCurrentCourse } from '@/hooks'
import { UserRoles } from '@/types'

const DeleteModal: React.FC<{
  open: boolean
  handleClose: () => void
  handleDelete: () => void
}> = ({ open, handleClose, handleDelete }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle>Delete this comment?</DialogTitle>
      <DialogContent sx={{ width: 500 }}>
        <DialogContentText id="alert-dialog-description">
          This action cannot be reversed.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleDelete}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export const CommentCard: React.FC<{
  author: string
  body: string
  id: string
  numReplies: number
  problemId: string
  handleDelete: (commentId: string) => Promise<void>
  fetchComments: () => Promise<void>
}> = ({ author, body, id, handleDelete, numReplies, problemId, fetchComments }) => {
  const { user } = useAuth()
  const courseID = useCurrentCourse()

  const canDelete = useMemo(
    () =>
      author === user?.username ||
      user?.courses.some(
        (course) => course.oid === courseID && course.role === UserRoles.Instructor
      ),
    [author, courseID, user?.courses, user?.username]
  )

  const [openDelete, setOpenDelete] = React.useState(false)

  const handleClickOpen = () => {
    setOpenDelete(true)
  }

  const handleClose = () => {
    setOpenDelete(false)
  }

  return (
    <Grid container justifyContent={'space-between'} flexWrap={'nowrap'}>
      <Grid gap={2.5} alignItems={'baseline'} flexWrap={'nowrap'} container>
        <UserAvatar username={author} />
        <Grid container direction={'column'}>
          <Typography fontWeight={600}>{author}</Typography>
          <Typography>{parse(body)}</Typography>

          <ReplyButton originalCommentId={id} problemId={problemId} fetchComments={fetchComments} />
          {numReplies > 0 && (
            <RepliesAccordion
              numReplies={numReplies}
              originalCommentId={id}
              fetchComments={fetchComments}
            />
          )}
        </Grid>
      </Grid>
      <Grid item>
        {canDelete && (
          <IconButton onClick={handleClickOpen}>
            <DeleteOutlineTwoToneIcon color={'error'} />
          </IconButton>
        )}
      </Grid>
      <DeleteModal
        open={openDelete}
        handleClose={handleClose}
        handleDelete={async () => {
          await handleDelete(id)
          handleClose()
        }}
      />
    </Grid>
  )
}
