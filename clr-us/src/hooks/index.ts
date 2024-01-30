import useAuth from "../context/context";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const useRedirectLogin = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [navigate, user])

}
