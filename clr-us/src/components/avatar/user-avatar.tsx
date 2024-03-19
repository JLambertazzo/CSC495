import { Avatar } from '@mui/material'
import React, { useMemo } from 'react'

import useAuth from '@/context/context'

export const UserAvatar: React.FC<{ username?: string }> = ({ username }) => {
  const { user } = useAuth()

  // TODO: with Shibboleth, this should be based on their first/last name
  const initial = useMemo(
    () => (username ? username[0].toUpperCase() : user?.username[0].toUpperCase()),
    [user?.username, username]
  )

  return <Avatar>{initial}</Avatar>
}
