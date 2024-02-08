import { Grid, Typography } from '@mui/material'
import React from 'react'

import { Sidebar } from '@/components/navbar'
import { useCourseCheck } from '@/hooks'

export const QuizPage: React.FC = () => {
  useCourseCheck()
  return (
    <Grid container sx={{ background: 'rgba(243, 246, 249, 0.6)', height: '100vh', width: '100%' }}>
      <Sidebar />
      <Grid sx={{ p: 1 }}>
        <Typography variant={'h4'}>Quizzes</Typography>
      </Grid>
    </Grid>
  )
}
