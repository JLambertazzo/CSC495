import {
  Box,
  Card,
  CircularProgress,
  Divider,
  Grid,
  List,
  ListItem,
  Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { Sidebar } from '@/components/navbar'
import { useCourseCheck } from '@/hooks'
import { useGetClassId } from '@/hooks/useGetClassId'
import { useGetProblemType } from '@/hooks/useGetProblemType'
import { Problem, ProblemStatus } from '@/types/problem'

import { problemService } from './problem.service'

const getListItem = (problem: Problem) => (
  <ListItem>
    <Card sx={{ p: 3 }}>
      <Link to={problem.id} style={{ textDecoration: 'none' }}>
        <Typography variant="h6" sx={{ mb: 0, pb: 0 }}>
          {problem.title}
        </Typography>
      </Link>
      <Typography variant="caption">Last Edit by {problem.author}</Typography>
      <br />
      <Typography variant="body1">{problem.body}</Typography>
    </Card>
  </ListItem>
)

export const ProblemPage: React.FC = () => {
  useCourseCheck()
  const problemType = useGetProblemType()
  const classId = useGetClassId()
  const [problems, setProblems] = useState<Problem[] | undefined>(undefined)

  useEffect(() => {
    if (problemType) {
      problemService.getProblems(classId, ProblemStatus.Posted, problemType, setProblems)
    }
  }, [problemType, classId, setProblems])

  return (
    <Grid
      container
      sx={{
        background: 'rgba(243, 246, 249, 0.6)',
        height: '100vh',
        width: '100%',
        justifyContent: 'flex-start',
      }}
    >
      <Sidebar />
      <Grid direction="column" sx={{ mx: 2, maxWidth: '70%' }}>
        <Typography variant="h5" sx={{ my: 4 }}>
          {problemType} Problems
        </Typography>
        <Divider />
        <Box>{problems ? <List>{problems.map(getListItem)}</List> : <CircularProgress />}</Box>
      </Grid>
    </Grid>
  )
}
