import React, { useMemo } from 'react'

import useAuth from '@/context/context'
import { useRedirectLogin } from '@/hooks'

export const CoursePage: React.FC = () => {
  useRedirectLogin()
  const { user } = useAuth()
  const userCourses = useMemo(() => user?.courses, [user])
  return <>Welcome</>
}
