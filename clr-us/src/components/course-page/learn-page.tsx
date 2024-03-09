import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import { Grid, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

import { Sidebar } from '@/components/navbar'
import { useCourseCheck } from '@/hooks'
import { theme } from '@/themes/theme'

const categories: { text: string; desc: string; route: string }[] = [
  { text: 'CLRS', desc: 'Problems from the CLRS textbook', route: './clrs' },
  { text: 'Tutorial', desc: 'Tutorial problems', route: './tutorial' },
  { text: 'Lecture', desc: 'Problems from lecture', route: './lecture' },
  { text: 'Other', desc: 'All other problems', route: './other' },
]

const CategoryButton = (props: { text: string; desc: string; route: string; first?: boolean }) => (
  <Link to={props.route} style={{ textDecoration: 'none', paddingBottom: 12, width: '100%' }}>
    <Grid
      container
      py={1.8}
      px={2}
      sx={{
        background: 'white',
        borderRadius: 2,
        pl: 4,
        alignItems: 'center',
        justifyContent: 'space-between',
        ':hover': {
          outline: 'solid 1px #acc0d8',
          background: '#f7f7f7',
        },
      }}
    >
      <Grid direction={'column'}>
        <Typography variant={'h4'} color={theme.palette.primary.main}>
          {props.text}
        </Typography>
        <Typography
          variant={'h6'}
          fontWeight={400}
          fontSize={'1.1rem'}
          color={theme.palette.text.secondary}
        >
          {props.desc}
        </Typography>
      </Grid>
      <Grid>
        <KeyboardArrowRightIcon sx={{ color: theme.palette.text.secondary, display: 'flex' }} />
      </Grid>
    </Grid>
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
        sx={{ p: 1, height: '100%', width: '50%', minWidth: '200px', textAlign: 'left' }}
        alignItems="baseline"
        justifyContent="center"
        direction="column"
        gap={2}
      >
        <Typography variant="h5">Explore Problems:</Typography>
        {categories.map(({ text, route, desc }, i) => (
          <CategoryButton text={text} route={route} key={route} first={!i} desc={desc} />
        ))}
      </Grid>
    </Grid>
  )
}
