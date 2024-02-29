import { School as SchoolIcon, Menu as MenuIcon, Quiz as QuizIcon } from '@mui/icons-material'
import {
  Chip,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
} from '@mui/material'
import Typography from '@mui/material/Typography'
import React, { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import useAuth from '@/context/context'
import { RouteList } from '@/enum'
import { useCurrentCourse, useIsLarge } from '@/hooks'

function Tab(props: { text: string; route: string; icon: React.ReactElement }) {
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
      <ListItemButton selected={isSelected}>
        <ListItemIcon>{props.icon}</ListItemIcon>
        <ListItemText primary={props.text}></ListItemText>
      </ListItemButton>
    </Link>
  )
}

export const Sidebar: React.FC = () => {
  const courseId = useCurrentCourse()
  const { user } = useAuth()
  const [courseCode, setCourseCode] = React.useState('')
  const largeScreen = useIsLarge()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const found = user?.courses.find((course) => course.oid === courseId)?.code
    if (found) {
      setCourseCode(found)
    }
  }, [courseId, user, setCourseCode])

  return (
    <>
      <IconButton
        aria-label="menu"
        onClick={() => setOpen(true)}
        sx={{ position: 'absolute', top: '1rem', left: '1rem', width: '20px', height: '20px' }}
      >
        <MenuIcon fontSize="large" />
      </IconButton>
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
        variant={largeScreen ? 'permanent' : 'temporary'}
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
      >
        <Stack mt={2} gap={3}>
          <Link
            to={`/`}
            style={{
              textDecoration: 'none',
            }}
          >
            <Typography
              variant="h2"
              component="div"
              sx={{
                flexGrow: 1,
                mx: 2,
                textAlign: 'center',
                px: 1.5,
                borderRadius: 3,
              }}
            >
              CLR:US
            </Typography>
            <Typography variant="h6" sx={{ textAlign: 'center', color: 'black' }}>
              Class: <Chip sx={{ fontWeight: 'bolder' }} label={courseCode.toUpperCase()} />
            </Typography>
          </Link>
          <Stack>
            <List component="nav">
              <Divider />
              <Tab route={RouteList.Learn} text={'Learn'} icon={<SchoolIcon />} />
              <Divider />
              <Tab route={RouteList.Quizzes} text={'Quizzes'} icon={<QuizIcon />} />
            </List>
          </Stack>
        </Stack>
      </Drawer>
    </>
  )
}
