import {
  Tab,
  Box,
  Card,
  CircularProgress,
  Grid,
  List,
  ListItem,
  Tabs,
  Typography,
  Divider,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { Sidebar } from '@/components/navbar'
import useAuth from '@/context/context'
import { ProblemType } from '@/enum'
import { useCourseCheck } from '@/hooks'
import { useGetClassId } from '@/hooks/useGetClassId'
import { useGetProblemType } from '@/hooks/useGetProblemType'
import { Problem, ProblemStatus } from '@/types/problem'

import { CustomTabPanel } from '../tab-panel'

import { problemService } from './problem.service'

const getListItem = (problem: Problem) => (
  <ListItem>
    <Card sx={{ p: 3 }}>
      <Link to={problem.id} style={{ textDecoration: 'none' }}>
        <Typography variant="h6">{problem.title}</Typography>
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
  const { user } = useAuth()
  const [postedProblems, setPostedProblems] = useState<Problem[] | undefined>(undefined)
  const [endorsedProblems, setEndorsedProblems] = useState<Problem[] | undefined>(undefined)
  const [reviewProblems, setReviewProblems] = useState<Problem[] | undefined>(undefined)
  const [tab, setTab] = useState(0)
  const [isInstructor, setIsInstructor] = useState(false)

  useEffect(
    () =>
      setIsInstructor(
        !!user?.courses.some((course) => course.oid === classId && course.role === 'Instructor')
      ),
    [user, classId, setIsInstructor]
  )

  useEffect(() => {
    if (problemType) {
      problemService.getProblems(classId, ProblemStatus.Posted, problemType, setPostedProblems)
      problemService.getProblems(classId, ProblemStatus.Endorsed, problemType, setEndorsedProblems)
      if (isInstructor) {
        problemService.getProblems(classId, ProblemStatus.Review, problemType, setReviewProblems)
      }
    }
  }, [
    problemType,
    classId,
    setPostedProblems,
    setEndorsedProblems,
    setReviewProblems,
    isInstructor,
  ])

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
        <Box>
          <Tabs
            value={tab}
            onChange={(_, newValue) => setTab(newValue)}
            aria-label="problem type tabs"
          >
            {isInstructor && problemType?.toLowerCase() !== ProblemType.CLRS.toLowerCase() && (
              <Tab label="Review" id="tab-review" aria-controls="simple-tabpanel-0" />
            )}
            <Tab label="In Progress" id="tab-in-progress" aria-controls="simple-tabpanel-1" />
            <Tab label="Endorsed" id="tab-endorsed" aria-controls="simple-tabpanel-2" />
          </Tabs>
        </Box>
        <Divider />
        {isInstructor && problemType?.toLowerCase() !== ProblemType.CLRS.toLowerCase() && (
          <CustomTabPanel value={tab} index={0}>
            <Box>
              {reviewProblems ? (
                <List>{reviewProblems.map(getListItem)}</List>
              ) : (
                <CircularProgress />
              )}
            </Box>
          </CustomTabPanel>
        )}
        <CustomTabPanel value={tab} index={1}>
          <Box>
            {postedProblems ? <List>{postedProblems.map(getListItem)}</List> : <CircularProgress />}
          </Box>
        </CustomTabPanel>
        <CustomTabPanel value={tab} index={2}>
          <Box>
            {endorsedProblems ? (
              <List>{endorsedProblems.map(getListItem)}</List>
            ) : (
              <CircularProgress />
            )}
          </Box>
        </CustomTabPanel>
      </Grid>
    </Grid>
  )
}
