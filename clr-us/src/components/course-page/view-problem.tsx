import { Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import 'react-quill/dist/quill.snow.css'

import { Sidebar } from '@/components/navbar'
import { ProblemStatus } from '@/enum'
import { useGetProblemId, useGetProblemType } from '@/hooks'
import { Problem } from '@/types/problem'

import { EndorsedProblem } from './endorsed-problem'
import { PostedProblem } from './posted-problem'
import { problemService } from './problem.service'
import { ReviewProblem } from './review-problem'

export const ViewProblem: React.FC = () => {
  const problemType = useGetProblemType()
  const problemId = useGetProblemId()
  const [problem, setProblem] = useState<Problem | undefined>(undefined)
  const [status, setStatus] = useState<ProblemStatus>(ProblemStatus.Posted)

  const forceRefresh = () => problemService.getProblem(problemId, setProblem)

  useEffect(() => {
    problemService.getProblem(problemId, setProblem)
  }, [problemId, setProblem])

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
        <PostedProblem problemType={problemType} problem={problem} />
      ) : (
        <EndorsedProblem problemType={problemType} problem={problem} forceRefresh={forceRefresh} />
      )}
    </Grid>
  )
}
