import { Button, Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import 'react-quill/dist/quill.snow.css'
import { useNavigate } from 'react-router-dom'

import { Sidebar } from '@/components/navbar'
import { TextEditor } from '@/components/text-editor/text-editor'
import { useGetProblemId, useGetProblemType, useInstructorCheck } from '@/hooks'
import { Problem } from '@/types/problem'

import { problemService } from './problem.service'

export const ViewProblem: React.FC = () => {
  useInstructorCheck()
  const problemType = useGetProblemType()
  const problemId = useGetProblemId()
  const [problem, setProblem] = useState<Problem | undefined>(undefined)
  const navigate = useNavigate()

  useEffect(() => {
    problemService.getProblem(problemId, setProblem)
  }, [problemId, setProblem])

  return (
    <Grid
      container
      sx={{
        background: 'rgba(243, 246, 249, 0.6)',
        height: '100vh',
        width: '100%',
      }}
    >
      <Sidebar />
      <Grid p={5} width={'70vw'}>
        <Typography textTransform={'capitalize'} variant={'h4'}>
          {problemType} Problem
        </Typography>
        <Grid container py={3} direction={'column'} gap={2} width={'100%'}>
          <Typography variant={'h5'}>Problem</Typography>
          <Typography variant="h6">{problem?.title}</Typography>
          <TextEditor value={problem?.body ?? ''} onChange={() => {}} />
        </Grid>
        <Grid container direction={'column'} gap={2} width={'100%'} mt={5}>
          <Typography variant={'h5'}>Solution</Typography>
          <Typography color={'#B0B0B0'}>The student submitted the following solution.</Typography>
          <TextEditor value={problem?.solution ?? ''} onChange={() => {}} />
        </Grid>
        <Grid sx={{ width: 'fit-content', mt: 10 }}>
          <Button
            onClick={problemService.approveProblem(navigate, problemId)}
            variant={'contained'}
            sx={{ mr: 1 }}
          >
            Accept
          </Button>
          <Button onClick={problemService.deleteProblem(navigate, problemId)} variant={'outlined'}>
            Delete
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}
