import { useLocation } from 'react-router-dom'

export const useGetProblemId = () => {
  const location = useLocation()
  return location.pathname.split('/')[4]
}
