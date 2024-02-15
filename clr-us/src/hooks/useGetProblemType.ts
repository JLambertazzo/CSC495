import { useLocation } from 'react-router-dom'

import { ProblemType } from '@/enum'

const toProblemType = new Map<string, ProblemType>([
  ['clrs', ProblemType.CLRS],
  ['tutorial', ProblemType.Tutorial],
  ['lecture', ProblemType.Lecture],
  ['other', ProblemType.Other],
])

export const useGetProblemType = () => {
  const location = useLocation()
  const problemType = location.pathname.split('/')[3]
  return toProblemType.get(problemType)
}
