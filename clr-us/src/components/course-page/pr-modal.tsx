import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Modal,
  Typography,
} from '@mui/material'
import parse from 'html-react-parser'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import useAuth from '@/context/context'
import { PullRequest } from '@/types'
import { Problem } from '@/types/problem'

import { problemService } from './problem.service'
import { pullRequestService } from './pullrequest.service'

const PrCard = (props: { pr: PullRequest; byUser?: boolean; close: VoidFunction }) => {
  const navigate = useNavigate()
  const handleUpvote = () => {
    pullRequestService.upvote(props.pr.id).then(() => setUpvotes(upvotes + 1))
  }
  const handleMerge = () => {
    const goToNewProblem = (problem: Problem) => {
      navigate(`./../${problem.id}`)
      props.close()
    }
    pullRequestService
      .merge(props.pr.id)
      .then(() => problemService.getLatest(props.pr.problemId, goToNewProblem))
  }
  const [upvotes, setUpvotes] = useState(props.pr.upvotes)

  return (
    <Card sx={{ my: 2 }}>
      <CardHeader title={'Suggested By ' + props.pr.author} />
      <CardContent>
        <Typography variant="h6">Suggested Solution:</Typography>
        <Typography variant="body1">{parse(props.pr.body)}</Typography>
      </CardContent>
      <CardActions>
        {props.byUser ? (
          <Button disabled={upvotes < 10} onClick={handleMerge}>
            Merge
          </Button>
        ) : (
          <>
            <IconButton onClick={handleUpvote}>
              <ThumbUpIcon />
            </IconButton>
            <Typography>{upvotes} Approvals</Typography>
          </>
        )}
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
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  maxHeight: '80vh',
  overflow: 'scroll',
}

export const PrModal = (props: { prs: PullRequest[] }) => {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()

  return (
    <>
      {props.prs.length > 0 && (
        <Button type="button" sx={{ width: 'max-content' }} onClick={() => setOpen(true)}>
          <Typography variant={'caption'} sx={{ textDecoration: 'underline' }}>
            {props.prs.length} Suggested Edits
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
              byUser={pr.author === user?.id}
              close={() => setOpen(false)}
            />
          ))}
        </Box>
      </Modal>
    </>
  )
}
