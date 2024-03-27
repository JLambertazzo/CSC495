import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  IconButton,
  Modal,
  Stack,
  Typography,
} from '@mui/material'
import parse from 'html-react-parser'
import React, { useMemo, useState } from 'react'

import useAuth from '@/context/context'
import { PullRequest } from '@/types'

import { pullRequestService } from './pullrequest.service'

const PrCard = (props: {
  pr: PullRequest
  byUser?: boolean
  close: VoidFunction
  setPr: React.Dispatch<React.SetStateAction<PullRequest[] | null>>
  forceRefresh: VoidFunction
}) => {
  const { user } = useAuth()

  // Temporarily set to 1 for the demo. TODO: Set this to 5
  const numApprovalsRequired = 1

  const username = useMemo(() => user?.username ?? '', [user?.username])

  const didUserUpvote = useMemo(
    () => props.pr.upvoters.includes(username),
    [props.pr.upvoters, username]
  )

  const isUserAuthor = useMemo(() => props.pr.author === username, [props.pr.author, username])

  const handleUpvote = () => {
    if (isUserAuthor) {
      return
    }
    pullRequestService
      .upvote(props.pr.id, username)
      .then(() => pullRequestService.getPullRequests(props.pr.problemUuid, props.setPr))
  }
  const handleMerge = () => {
    pullRequestService
      .merge(props.pr.id)
      .then(() => pullRequestService.getPullRequests(props.pr.problemUuid, props.setPr))
      .then(() => {
        props.forceRefresh()
        props.close()
      })
  }

  return (
    <Card sx={{ my: 2 }}>
      <CardContent>
        <Stack gap={1.5} alignItems={'flex-start'}>
          <Chip
            sx={{ background: '#e7f2ff', color: '#022D6D' }}
            icon={<AccountCircleIcon style={{ color: '#022D6D' }} />}
            label={props.pr.author}
          />
          <Typography variant="h6">Suggested Solution:</Typography>
          <Typography variant="body1">{parse(props.pr.body)}</Typography>
        </Stack>
      </CardContent>
      <CardActions>
        {props.byUser ? (
          <Button disabled={props.pr.upvoters.length < numApprovalsRequired} onClick={handleMerge}>
            Merge
          </Button>
        ) : (
          <>
            <IconButton onClick={handleUpvote} disabled={isUserAuthor}>
              <ThumbUpIcon
                color={didUserUpvote ? 'success' : isUserAuthor ? 'disabled' : 'inherit'}
              />
            </IconButton>
          </>
        )}
        <Typography>
          {props.pr.upvoters.length}/{numApprovalsRequired} Approvals
        </Typography>
      </CardActions>
    </Card>
  )
}

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80vw',
  bgcolor: 'background.paper',
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
  maxHeight: '80vh',
  overflow: 'scroll',
}

export const PrModal = (props: {
  prs: PullRequest[]
  setPr: React.Dispatch<React.SetStateAction<PullRequest[] | null>>
  forceRefresh: VoidFunction
}) => {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()

  return (
    <>
      {props.prs.length > 0 && (
        <Button type="button" sx={{ width: 'max-content' }} onClick={() => setOpen(true)}>
          <Typography variant={'caption'} sx={{ textDecoration: 'underline' }}>
            {props.prs.length} Suggested {props.prs.length > 1 ? 'Edits' : 'Edit'}
          </Typography>
        </Button>
      )}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {props.prs.map((pr) => (
            <PrCard
              pr={pr}
              key={pr.id}
              byUser={pr.author === user?.username}
              close={() => setOpen(false)}
              forceRefresh={props.forceRefresh}
              setPr={props.setPr}
            />
          ))}
        </Box>
      </Modal>
    </>
  )
}
