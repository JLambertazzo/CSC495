import { Drawer, Stack } from '@mui/material'
import Typography from '@mui/material/Typography'
import React, { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { RouteList } from '@/enum'
import { useCurrentCourse } from '@/hooks'
import { theme } from '@/themes/theme'

function Tab(props: { text: string; route: string }) {
  const location = useLocation()
  const isSelected = useMemo(
    () => location.pathname.split('/')[2] == props.route,
    [location.pathname, props.route]
  )
  const courseId = useCurrentCourse()
  return (
    <Link
      to={`/${courseId}/${props.route}`}
      style={{
        textDecoration: 'none',
      }}
    >
      <Typography
        variant={'h5'}
        sx={{
          p: 1,
          py: 2,
          textAlign: 'center',
          color: theme.palette.primary.dark,
          backgroundColor: isSelected ? '#92afd2' : 'white',
          borderBlock: 'solid 1px #2E73C5',
        }}
      >
        {props.text}
      </Typography>
    </Link>
  )
}

export const Sidebar: React.FC = () => {
  return (
    <Drawer
      sx={{
        width: 300,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 300,
          boxSizing: 'border-box',
          py: 2,
          background: '#e7f2ff',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Stack mt={2} gap={3}>
        <Link
          to={`/`}
          style={{
            textDecoration: 'none',
          }}
        >
          <Typography
            variant="h4"
            component="div"
            sx={{
              flexGrow: 1,
              mx: 2,
              textAlign: 'center',
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              p: 1.5,
              borderRadius: 3,
            }}
          >
            CLRUS
          </Typography>
        </Link>

        <Stack>
          <Tab route={RouteList.Learn} text={'Learn'} />
          <Tab route={RouteList.Quizzes} text={'Quizzes'} />
        </Stack>
      </Stack>
    </Drawer>
  )
}
