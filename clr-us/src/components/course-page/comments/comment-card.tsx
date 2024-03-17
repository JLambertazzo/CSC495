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
import useAuth from '@/context/context'
import { useCurrentCourse } from '@/hooks'
import { Roles } from '@/types'

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
  commentId: string
  handleDelete: (commentId: string) => Promise<void>
}> = ({ author, body, commentId, handleDelete }) => {
  const { user } = useAuth()
  const courseID = useCurrentCourse()

  const canDelete = useMemo(
    () =>
      author === user?.username ||
      user?.courses.some((course) => course.oid === courseID && course.role === Roles.Instructor),
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
          await handleDelete(commentId)
          handleClose()
        }}
      />
    </Grid>
  )
}
