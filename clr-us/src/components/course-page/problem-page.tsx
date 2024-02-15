import { Grid } from '@mui/material'
import React from 'react'

import { Sidebar } from '@/components/navbar'
import { useCourseCheck } from '@/hooks'
import { useGetProblemType } from '@/hooks/useGetProblemType'

export const ProblemPage: React.FC = () => {
  useCourseCheck()
  const problemType = useGetProblemType()
  return (
    <Grid
      container
      direction={'row'}
      sx={{
        background: 'rgba(243, 246, 249, 0.6)',
        height: '100vh',
        width: '100%',
        justifyContent: 'center',
      }}
    >
      <Sidebar />
      <Grid>Page for {problemType} problems</Grid>
    </Grid>
  )
}
