import { useMediaQuery } from '@mui/material'

export const useIsLarge = () => useMediaQuery('(min-width:1024px)')
export const useIsSmall = () => useMediaQuery('(min-width:640px)')
