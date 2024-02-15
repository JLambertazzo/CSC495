import { useLocation } from 'react-router-dom'

export const useGetClassId = () => {
  const location = useLocation()
  return location.pathname.split('/')[1]
}
