import { Button, Grid, Tooltip, Typography } from '@mui/material'
import { Field, Form, Formik, FieldProps, ErrorMessage } from 'formik'
import { TextField } from 'formik-mui'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import 'react-quill/dist/quill.snow.css'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

import { postService } from '@/components/course-page/post.service'
import { Sidebar } from '@/components/navbar'
import { TextEditor } from '@/components/text-editor/text-editor'
import useAuth from '@/context/context'
import { ProblemType, RouteList } from '@/enum'
import { useCourseCheck, useCurrentCourse, useGetProblemType } from '@/hooks'
import { useNotification } from '@/hooks/useNotification'

import { IPostProblem } from './type'

export const PostProblem: React.FC = () => {
  useCourseCheck()
  const course = useCurrentCourse()
  const { user } = useAuth()
  const problemType = useGetProblemType()
  const isCLRSProblem = useMemo(() => problemType === ProblemType.CLRS, [problemType])
  const navigate = useNavigate()
  const notify = useNotification()

  const [initialValues, setInitialValues] = useState({
    author: user?.id || '',
    title: '',
    body: '',
    solution: '',
  } as IPostProblem)

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    body: Yup.string().required('Problem is required'),
    solution: Yup.string().required('Solution attempt is required'),
  })

  useEffect(() => {
    if (isCLRSProblem) {
      // TODO: Make this dynamic, problem to be selected in a dropdown
      postService.getCLRSProblem(15, 1).then((res) => {
        setInitialValues({
          ...initialValues,
          ...res,
        })
      })
    }
  }, [isCLRSProblem, setInitialValues, initialValues])

  const handleSubmit = useCallback(
    async (values: IPostProblem) => {
      if (isCLRSProblem) {
        await postService
          .postCLRSProblem({
            // TODO: Make this dynamic
            chapter: 15,
            problem: 1,
            solution: values.solution,
            userId: values.author,
            offeringId: course,
          })
          .then(() => {
            notify({
              message: 'Success! Your CLRS problem is now under review.',
              severity: 'success',
            })
            navigate(`/${course}/${RouteList.Problems}/${problemType.toLowerCase()}`)
          })
          .catch(() =>
            notify({ message: 'Error: failed to create new problem', severity: 'error' })
          )
      } else {
        await postService
          .postProblemScratch(values, course, problemType)
          .then(() => {
            notify({
              message: 'Success! Your new problem is now under review.',
              severity: 'success',
            })
            navigate(`/${course}/${RouteList.Problems}/${problemType.toLowerCase()}`)
          })
          .catch(() =>
            notify({ message: 'Error: failed to create new problem', severity: 'error' })
          )
      }
    },
    [course, isCLRSProblem, navigate, problemType, notify]
  )

  return (
    <Grid
      container
      sx={{
        background: 'white',
        height: '100vh',
        width: '100%',
      }}
    >
      <Sidebar />
      <Grid p={5} width={'70vw'}>
        <Formik
          enableReinitialize
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
                  disabled={isCLRSProblem}
                  style={{ width: '30%' }}
                />
                <Field name="body">
                  {({ field }: FieldProps) => (
                    <TextEditor
                      value={field.value}
                      onChange={field.onChange(field.name)}
                      readOnly={isCLRSProblem}
                    />
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
