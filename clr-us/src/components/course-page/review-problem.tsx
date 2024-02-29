import { Alert, AlertTitle, Button, Grid, Typography } from '@mui/material'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { ProblemType } from '@/enum'
import { useInstructorCheck } from '@/hooks'
import { Problem } from '@/types/problem'
import { getAiReviewSpecs, getAiSeverity } from '@/util'

import { TextEditor } from '../text-editor/text-editor'

import { problemService } from './problem.service'

export const ReviewProblem = (props: { problemType: ProblemType; problem?: Problem }) => {
  useInstructorCheck()
  const navigate = useNavigate()
  const aiAlert = useMemo(
    () => (props.problem?.aiReview ? getAiSeverity(props.problem.aiReview.aiScore) : null),
    [props.problem?.aiReview]
  )
  const aiText = useMemo(
    () => getAiReviewSpecs(props.problem?.aiReview?.aiScore ?? 0)?.text,
    [props.problem?.aiReview?.aiScore]
  )

  return (
    <Grid p={5} width={'70vw'}>
      <Typography textTransform={'capitalize'} variant={'h4'}>
        {props.problemType} Problem
      </Typography>
      <Grid container py={3} direction={'column'} gap={2} width={'100%'}>
        <Typography variant={'h5'}>Problem</Typography>
        <Typography variant="h6">{props.problem?.title}</Typography>
        <TextEditor value={props.problem?.body ?? ''} onChange={() => {}} readOnly />
      </Grid>
      <Grid container direction={'column'} gap={2} width={'100%'} mt={5}>
        <Typography variant={'h5'}>Solution</Typography>
        <Typography color={'#B0B0B0'}>The student submitted the following solution.</Typography>
        <TextEditor value={props.problem?.solution ?? ''} onChange={() => {}} readOnly />
      </Grid>
      <Grid container direction="column" sx={{ mt: 7 }} gap={2}>
        {aiAlert && (
          <Alert severity={aiAlert}>
            <AlertTitle>AI Review: {aiText}</AlertTitle>
            Our AI model has reviewed the student&apos;s solution attempt and has given it a score
            of <strong>{props.problem?.aiReview?.aiScore}</strong> out of <strong>10</strong>.
          </Alert>
        )}
        <Grid>
          <Button
            onClick={problemService.approveProblem(navigate, props.problem?.id ?? '')}
            variant={'contained'}
            sx={{ mr: 1 }}
          >
            Accept
          </Button>
          <Button
            onClick={problemService.deleteProblem(navigate, props.problem?.id ?? '')}
            variant={'outlined'}
          >
            Delete
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}
