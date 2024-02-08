import { Box, Grid } from '@mui/material'
import React, { useMemo } from 'react'

import { useRedirectLogin } from '@/hooks'

import useAuth from '../../context/context'
import { Navbar } from '../navbar/navbar'

import { CourseCard } from './course-card'

export const Home: React.FC = () => {
  useRedirectLogin()
  const { user } = useAuth()
  const userCourses = useMemo(() => user?.courses, [user])

  return (
    <Box sx={{ background: 'rgba(243, 246, 249, 0.6)', height: '100vh', width: '100%' }}>
      <Navbar />
      <Grid container width="fit-content" m={5} gap={3}>
        {userCourses?.map((course) => <CourseCard course={course} key={course.oid} />)}
      </Grid>
    </Box>
  )
}
