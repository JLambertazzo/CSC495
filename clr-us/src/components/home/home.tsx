import { Box } from '@mui/material'
import React, { useMemo } from 'react'

import useAuth from '../../context/context'
import { useRedirectLogin } from '../../hooks'
import { Navbar } from '../navbar/navbar'

export const Home: React.FC = () => {
  useRedirectLogin()
  const { user } = useAuth()
  const userCourses = useMemo(() => user?.courses, [user])

  return (
    <>
      <Navbar />
      <Box>{userCourses?.map((course) => <div key={course.oid}>{course.code}</div>)}</Box>
    </>
  )
}
