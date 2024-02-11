import { Box, Button, Stack, Typography } from '@mui/material'
import { Formik, Field, Form } from 'formik'
import { TextField } from 'formik-mui'
import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

import bgImage from '../../assets/loginbg.svg'
import useAuth from '../../context/context'

import { loginService } from './login.service'

type LoginPayload = {
  username: string
  password: string
}

const initialValues: LoginPayload = {
  username: '',
  password: '',
}

const validationSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
})

export const Login: React.FC = () => {
  const { setUser } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = useCallback(
    async (values: LoginPayload, { setFieldError }: any) => {
      await loginService.loginUser(values.username, values.password, setUser).then((err) => {
        if (!err) {
          navigate('/')
        } else {
          setFieldError('password', 'Incorrect password!')
          console.log(err)
        }
      })
    },
    [navigate, setUser]
  )

  return (
    <Box
      sx={{
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        display: 'flex',
        alignItems: 'center',
        height: '100vh',
        justifyContent: 'center',
      }}
    >
      <Stack
        sx={{
          background: 'white',
          p: 3,
          borderRadius: 4,
          width: 500,
          alignItems: 'center',
          py: '50px',
        }}
      >
        <Typography variant="h3" component="h1">
          CLR-US
        </Typography>
        <Typography component="p">Welcome back! Please login.</Typography>

        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <Form>
            <Stack gap={2} mt={2}>
              <Field component={TextField} name={'username'} label="Username" type="text" />
              <Field component={TextField} name={'password'} label="Password" type="password" />
              <Button variant={'contained'} color={'primary'} type={'submit'}>
                Login
              </Button>
            </Stack>
          </Form>
        </Formik>
      </Stack>
    </Box>
  )
}
