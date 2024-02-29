import { useSnackbar } from '@/context/context'
import { SnackbarProps } from '@/types'

export const useNotification = () => {
  const { setSnackbarProps } = useSnackbar()
  return (data: Pick<SnackbarProps, 'message' | 'severity'>) => {
    setSnackbarProps({
      ...data,
      open: true,
    })
  }
}
