import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import useAuth from '../context/context'

const useCurrentCourse = () => {
  const location = useLocation()
  return location.pathname.split('/')[1]
}

const useCourseCheck = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const courseID = useCurrentCourse()

  useEffect(() => {
    if (!user) {
      navigate('/login')
    } else {
      if (courseID) {
        // Check if the user is enrolled in this course
        const matchingCourses = user.courses.find((course) => course.oid === courseID)
        if (!matchingCourses) navigate('/')
      } else {
        navigate('/')
      }
    }
  }, [courseID, navigate, user])
}

export { useCurrentCourse, useCourseCheck }
