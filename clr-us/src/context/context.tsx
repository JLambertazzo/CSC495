import { Alert, Snackbar } from '@mui/material'
import React, { ReactNode, useCallback, useContext, useEffect, useState } from 'react'

import { IUser, SnackbarProps } from '../types'

const userContext = React.createContext({
  user: null as IUser | null,
  setUser: ((user) => {
    void user
  }) as (user: IUser | null) => void,
})

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const local = localStorage.getItem('user')
  const localUser = local ? JSON.parse(local) : null
  const [user, setUser] = useState<IUser | null>(localUser)

  useEffect(() => {
    if (user?.username) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.clear()
    }
  }, [user])

  return <userContext.Provider value={{ user, setUser }}>{children}</userContext.Provider>
}

export default function useAuth() {
  return useContext(userContext)
}

const defaultProps: SnackbarProps = {
  open: false,
  message: '',
  severity: 'success',
}

const snackbarContext = React.createContext({
  snackbarProps: defaultProps,
  setSnackbarProps: (props: SnackbarProps) => {
    void props
  },
})

export function SnackbarProvider({ children }: { children: ReactNode }): JSX.Element {
  const local = localStorage.getItem('snackbar')
  const localProps = local ? JSON.parse(local) : defaultProps
  const [snackbarProps, setSnackbarProps] = useState<SnackbarProps>(localProps)

  useEffect(() => {
    localStorage.setItem('snackbar', JSON.stringify(snackbarProps))
  }, [snackbarProps])

  const onClose = useCallback(() => {
    setSnackbarProps({ ...snackbarProps, open: false })
  }, [snackbarProps])

  return (
    <snackbarContext.Provider value={{ snackbarProps, setSnackbarProps }}>
      <Snackbar
        onClose={onClose}
        autoHideDuration={5000}
        open={snackbarProps.open}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbarProps.severity} onClose={onClose} variant="filled">
          {snackbarProps.message}
        </Alert>
      </Snackbar>
      {children}
    </snackbarContext.Provider>
  )
}

export function useSnackbar() {
  return useContext(snackbarContext)
}
