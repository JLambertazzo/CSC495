import EditIcon from '@mui/icons-material/Edit'
import { Button, Card, CardActions, CardContent, Grid, Typography } from '@mui/material'
import { Formik, Form, Field, FieldProps, ErrorMessage } from 'formik'
import { useCallback, useState } from 'react'
import 'react-quill/dist/quill.snow.css'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

import useAuth from '@/context/context'
import { ProblemType } from '@/enum'
import { useCourseCheck } from '@/hooks'
import { IUser } from '@/types'
import { Problem } from '@/types/problem'

import { TextEditor } from '../text-editor/text-editor'

import { pullRequestService } from './pullrequest.service'
import { IPREdit } from './type'

const SolutionEditor = (props: { problem?: Problem; user: IUser | null }) => {
  const [initialValues] = useState<IPREdit>({
    author: props.user?.id ?? '',
    solution: props.problem?.solution ?? '',
  })
  const validationSchema = Yup.object().shape({
    solution: Yup.string().required('Solution attempt is required'),
  })
  const navigate = useNavigate()
  const handleSubmit = useCallback(
    async (values: IPREdit) => {
      await pullRequestService.postPullRequest(
        props.problem?.id ?? '',
        values.solution,
        values.author
      )
      navigate('..')
    },
    [props.problem, navigate]
  )
  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values }) => (
        <Form>
          <Field name="solution">
            {({ field }: FieldProps) => (
              <TextEditor value={field.value} onChange={field.onChange(field.name)} />
            )}
          </Field>
          <ErrorMessage name="solution">
            {(msg) => <Typography sx={{ color: 'red', mt: 4 }}>{msg}</Typography>}
          </ErrorMessage>
          <Grid sx={{ width: 'fit-content', mt: 10 }}>
            <Button type={'submit'} variant={'contained'} disabled={!values.solution}>
              Submit Edits
            </Button>
          </Grid>
        </Form>
      )}
    </Formik>
  )
}

export const PostedProblem = (props: { problemType: ProblemType; problem?: Problem }) => {
  useCourseCheck()
  const { user } = useAuth()
  const [editing, setEditing] = useState(false)

  return (
    <Grid p={5} width={'70vw'}>
      <Typography textTransform={'capitalize'} variant={'h4'}>
        {props.problemType} Problem
      </Typography>
      <Grid container py={3} direction={'column'} gap={2} width={'100%'}>
        <Typography variant={'h5'}>Problem</Typography>
        <Typography variant="h6">{props.problem?.title}</Typography>
        <Card sx={{ p: 2 }}>{props.problem?.body}</Card>
      </Grid>
      <Grid container direction={'column'} gap={2} width={'100%'} mt={5}>
        <Typography variant={'h5'}>Solution</Typography>
        <Typography color={'#B0B0B0'}>The student submitted the following solution.</Typography>
        {editing ? (
          <SolutionEditor problem={props.problem} user={user} />
        ) : (
          <Card sx={{ p: 2 }}>
            <CardContent>{props.problem?.solution}</CardContent>
            <CardActions>
              <Button
                endIcon={<EditIcon />}
                sx={{ color: 'black' }}
                variant="outlined"
                onClick={() => setEditing(true)}
              >
                Edit
              </Button>
            </CardActions>
          </Card>
        )}
      </Grid>
    </Grid>
  )
}
