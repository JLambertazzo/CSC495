import { Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import 'react-quill/dist/quill.snow.css'

import { Sidebar } from '@/components/navbar'
import { ProblemStatus } from '@/enum'
import { useGetProblemId, useGetProblemType } from '@/hooks'
import { Problem } from '@/types/problem'

import { PostedProblem } from './posted-problem'
import { problemService } from './problem.service'
import { ReviewProblem } from './review-problem'

export const ViewProblem: React.FC = () => {
  const problemType = useGetProblemType()
  const problemId = useGetProblemId()
  const [problem, setProblem] = useState<Problem | undefined>(undefined)
  const [inReview, setInReview] = useState(false)

  useEffect(() => {
    problemService.getProblem(problemId, setProblem)
  }, [problemId, setProblem])

  useEffect(() => {
    if (!problem) {
      return
    }
    setInReview(problem.status === ProblemStatus.Review)
  }, [problem, setInReview])

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
      {inReview ? (
        <ReviewProblem problemType={problemType} problem={problem} />
      ) : (
        <PostedProblem problemType={problemType} problem={problem} />
      )}
    </Grid>
  )
}
