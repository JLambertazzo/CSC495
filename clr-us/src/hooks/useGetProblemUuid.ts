import { useLocation } from 'react-router-dom'

export const useGetProblemUuid = () => {
  const location = useLocation()
  return location.pathname.split('/')[4]
}
