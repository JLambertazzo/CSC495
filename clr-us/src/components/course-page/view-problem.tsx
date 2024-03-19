import { Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import 'react-quill/dist/quill.snow.css'

import { Sidebar } from '@/components/navbar'
import { ProblemStatus } from '@/enum'
import { useGetProblemUuid, useGetProblemType } from '@/hooks'
import { Problem } from '@/types/problem'

import { EndorsedProblem } from './endorsed-problem'
import { PostedProblem } from './posted-problem'
import { problemService } from './problem.service'
import { ReviewProblem } from './review-problem'

export const ViewProblem: React.FC = () => {
  const problemType = useGetProblemType()
  const problemUuid = useGetProblemUuid()
  const [problem, setProblem] = useState<Problem | undefined>(undefined)
  const [status, setStatus] = useState<ProblemStatus>(ProblemStatus.Posted)

  const forceRefresh = () => problemService.getProblem(problemUuid, setProblem)

  useEffect(() => {
    problemService.getProblem(problemUuid, setProblem)
  }, [problemUuid, setProblem])

  useEffect(() => {
    if (!problem) {
      return
    }
    setStatus(problem.status)
  }, [problem, setStatus])

  return (
    <Grid
      container
      sx={{
        background: 'rgba(243, 246, 249, 0.6)',
        minHeight: '100vh',
        width: '100%',
      }}
    >
      <Sidebar />
      {status === ProblemStatus.Review ? (
        <ReviewProblem problemType={problemType} problem={problem} />
      ) : status === ProblemStatus.Posted ? (
        <PostedProblem problemType={problemType} problem={problem} forceRefresh={forceRefresh} />
      ) : (
        <EndorsedProblem problemType={problemType} problem={problem} forceRefresh={forceRefresh} />
      )}
    </Grid>
  )
}
