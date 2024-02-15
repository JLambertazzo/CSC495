import { Button, Grid, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import { ProblemType } from '@/enum'
import { useInstructorCheck } from '@/hooks'
import { Problem } from '@/types/problem'

import { TextEditor } from '../text-editor/text-editor'

import { problemService } from './problem.service'

export const ReviewProblem = (props: { problemType: ProblemType; problem?: Problem }) => {
  useInstructorCheck()
  const navigate = useNavigate()

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
      <Grid sx={{ width: 'fit-content', mt: 10 }}>
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
  )
}
