import { useLocation } from 'react-router-dom'

import { ProblemType } from '@/enum'

export const useGetProblemType = () => {
  const location = useLocation()
  return location.pathname.split('/')[3] as ProblemType
}
