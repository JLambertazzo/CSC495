import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import { Button, Grid, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

import { Sidebar } from '@/components/navbar'
import { useCourseCheck } from '@/hooks'

const categories: { text: string; route: string }[] = [
  { text: 'CLRS Problems', route: './clrs' },
  { text: 'Tutorial Problems', route: './tutorial' },
  { text: 'Lecture Problems', route: './lecture' },
  { text: 'Other Problems', route: './other' },
]

const CategoryButton = (props: { text: string; route: string; first?: boolean }) => (
  <Link to={props.route} style={{ textDecoration: 'none', paddingBottom: 20, width: '100%' }}>
    <Button
      size="large"
      variant={props.first ? 'contained' : 'outlined'}
      endIcon={<PlayCircleOutlineIcon />}
      fullWidth
    >
      <Typography variant="h6">{props.text}</Typography>
    </Button>
  </Link>
)

export const LearnPage: React.FC = () => {
  useCourseCheck()
  return (
    <Grid
      container
      sx={{
        background: 'rgba(243, 246, 249, 0.6)',
        height: '100vh',
        width: '100%',
        justifyContent: 'center',
      }}
    >
      <Sidebar />
      <Grid
        container
        sx={{ p: 1, height: '100%', width: '30%', textAlign: 'left' }}
        alignItems="center"
        justifyContent="center"
        direction="column"
      >
        {categories.map(({ text, route }, i) => (
          <CategoryButton text={text} route={route} key={route} first={!i} />
        ))}
      </Grid>
    </Grid>
  )
}
