import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import useAuth from '../context/context'

export const useRedirectLogin = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [navigate, user])
}
