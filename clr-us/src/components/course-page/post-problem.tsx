import { Button, Grid, Tooltip, Typography } from '@mui/material'
import { Field, Form, Formik, FieldProps, ErrorMessage } from 'formik'
import { TextField } from 'formik-mui'
import React, { useCallback, useMemo } from 'react'
import 'react-quill/dist/quill.snow.css'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

import { postService } from '@/components/course-page/post.service'
import { Sidebar } from '@/components/navbar'
import { TextEditor } from '@/components/text-editor/text-editor'
import useAuth from '@/context/context'
import { ProblemType, RouteList } from '@/enum'
import { useCourseCheck, useCurrentCourse, useGetProblemType } from '@/hooks'

import { IPostProblem } from './type'

export const PostProblem: React.FC = () => {
  useCourseCheck()
  const course = useCurrentCourse()
  const { user } = useAuth()
  const problemType = useGetProblemType()
  const isCLRSProblem = useMemo(() => problemType === ProblemType.CLRS, [problemType])
  const navigate = useNavigate()

  const initialValues: IPostProblem = {
    author: user?.id || '',
    title: '',
    body: '',
    solution: '',
  }

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    body: Yup.string().required('Problem is required'),
    solution: Yup.string().required('Solution attempt is required'),
  })

  const handleSubmit = useCallback(
    async (values: IPostProblem) => {
      await postService.postProblemScratch(values, course, problemType).then(() => {
        navigate(`/${course}/${RouteList.Learn}/${problemType.toLowerCase()}`)
      })
    },
    [course, navigate, problemType]
  )

  return (
    <Grid
      container
      sx={{
        background: 'rgba(243, 246, 249, 0.6)',
        height: '100vh',
        width: '100%',
      }}
    >
      <Sidebar />
      <Grid p={5} width={'70vw'}>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({ values }) => (
            <Form>
              <Typography textTransform={'capitalize'} variant={'h4'}>
                {problemType} Problem
              </Typography>
              {!isCLRSProblem && (
                <Typography color={'#B0B0B0'}>
                  Your submission will be reviewed by an instructor before being visible to others.
                </Typography>
              )}
              <Grid container py={3} direction={'column'} gap={2} width={'100%'}>
                <Typography variant={'h5'}>Problem</Typography>
                <Field
                  component={TextField}
                  name={'title'}
                  label="Problem Title"
                  type="text"
                  style={{ width: '30%' }}
                />
                <Field name="body">
                  {({ field }: FieldProps) => (
                    <TextEditor value={field.value} onChange={field.onChange(field.name)} />
                  )}
                </Field>
                <ErrorMessage name="body">
                  {(msg) => <Typography sx={{ color: 'red', mt: 4 }}>{msg}</Typography>}
                </ErrorMessage>
              </Grid>
              <Grid container direction={'column'} gap={2} width={'100%'} mt={9}>
                <Typography variant={'h5'}>Solution</Typography>
                <Typography color={'#B0B0B0'}>Write your attempted solution below.</Typography>
                <Field name="solution">
                  {({ field }: FieldProps) => (
                    <TextEditor value={field.value} onChange={field.onChange(field.name)} />
                  )}
                </Field>
                <ErrorMessage name="solution">
                  {(msg) => <Typography sx={{ color: 'red', mt: 4 }}>{msg}</Typography>}
                </ErrorMessage>
              </Grid>
              <Tooltip
                title={values.solution ? '' : 'You must attempt the question before posting'}
              >
                <Grid sx={{ width: 'fit-content', mt: 10 }}>
                  <Button type={'submit'} variant={'contained'} disabled={!values.solution}>
                    Post Question
                  </Button>
                </Grid>
              </Tooltip>
            </Form>
          )}
        </Formik>
      </Grid>
    </Grid>
  )
}
