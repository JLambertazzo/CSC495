import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import useAuth from '../context/context'

const useCurrentCourse = () => {
  const location = useLocation()
  return location.pathname.split('/')[1]
}

const useUserRole = () => {
  const { user } = useAuth()
  const courseID = useCurrentCourse()

  if (!user) {
    return undefined
  }
  return user.courses.find((course) => course.oid === courseID)?.role
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

// Requires user to be an instructor for the course
const useInstructorCheck = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const courseID = useCurrentCourse()

  useEffect(() => {
    if (!user) {
      navigate('/login')
    } else {
      if (courseID) {
        // Check if the user is instructor in this course
        const isInstructor = user.courses.some(
          (course) => course.oid === courseID && course.role === 'Instructor'
        )
        if (!isInstructor) navigate('/')
      } else {
        navigate('/')
      }
    }
  }, [courseID, navigate, user])
}

export { useCurrentCourse, useCourseCheck, useInstructorCheck, useUserRole }
