import EditIcon from '@mui/icons-material/Edit'
import { Button, Card, CardActions, CardContent, Grid, Typography } from '@mui/material'
import { Formik, Form, Field, FieldProps, ErrorMessage } from 'formik'
import parse from 'html-react-parser'
import { useCallback, useEffect, useState } from 'react'
import 'react-quill/dist/quill.snow.css'
import * as Yup from 'yup'

import useAuth from '@/context/context'
import { ProblemType } from '@/enum'
import { useCourseCheck, useUserRole } from '@/hooks'
import { useNotification } from '@/hooks/useNotification'
import { IUser, UserRoles } from '@/types'
import { Problem } from '@/types/problem'

import { TextEditor } from '../text-editor/text-editor'

import { ProblemAuthorChip, SolutionAuthorsChip } from './authors'
import { ProblemComments } from './comments'
import { problemService } from './problem.service'
import { pullRequestService } from './pullrequest.service'
import { IPREdit } from './type'

const SolutionEditor = (props: {
  problem?: Problem
  user: IUser | null
  closeEditor: VoidFunction
  forceRefresh: VoidFunction
}) => {
  const notify = useNotification()
  const [initialValues] = useState<IPREdit>({
    author: props.user?.username ?? '',
    solution: props.problem?.solution ?? '',
  })
  const validationSchema = Yup.object().shape({
    solution: Yup.string().required('Solution attempt is required'),
  })
  const handleSubmit = useCallback(
    async (values: IPREdit) => {
      await pullRequestService
        .postPullRequest(props.problem?.uuid ?? '', values.solution, values.author)
        .then(async () => {
          props.closeEditor()
          props.forceRefresh()
          notify({
            message: 'Success! Your edits have been applied.',
            severity: 'success',
          })
        })
    },
    [props, notify]
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
            <Button
              type={'submit'}
              variant={'contained'}
              disabled={!values.solution}
              sx={{ mr: 1 }}
            >
              Submit Edits
            </Button>
            <Button type={'button'} variant={'outlined'} onClick={() => props.closeEditor()}>
              Cancel
            </Button>
          </Grid>
        </Form>
      )}
    </Formik>
  )
}

export const EndorsedProblem = (props: {
  problemType: ProblemType
  problem?: Problem
  forceRefresh: VoidFunction
}) => {
  useCourseCheck()
  const { user } = useAuth()
  const [editing, setEditing] = useState(false)
  const role = useUserRole()
  const [solutionAuthors, setSolutionAuthors] = useState([])

  useEffect(() => {
    if (props.problem) {
      problemService.getSolutionAuthors(props.problem.uuid).then((res) => setSolutionAuthors(res))
    }
  }, [props.problem])

  return (
    <Grid p={5} width={'70vw'}>
      <Typography textTransform={'capitalize'} variant={'h4'}>
        {props.problemType} Problem
      </Typography>
      <Grid container py={3} direction={'column'} gap={2} width={'100%'}>
        <Typography variant={'h5'}>Problem</Typography>
        <Typography variant="h6">{props.problem?.title}</Typography>
        <ProblemAuthorChip solutionAuthors={solutionAuthors} />
        <Card sx={{ p: 2 }}>{parse(props.problem?.body ?? '')}</Card>
      </Grid>
      <Grid container direction={'column'} gap={2} width={'100%'} mt={5}>
        <Typography variant={'h5'}>Solution</Typography>
        <Typography color={'#B0B0B0'}>The instructor endorsed the following solution.</Typography>
        <SolutionAuthorsChip solutionAuthors={solutionAuthors} />
        {role === UserRoles.Instructor && editing ? (
          <SolutionEditor
            problem={props.problem}
            user={user}
            closeEditor={() => setEditing(false)}
            forceRefresh={props.forceRefresh}
          />
        ) : (
          <Card sx={{ p: 2 }}>
            <CardContent>{parse(props.problem?.solution ?? '')}</CardContent>
            {role === UserRoles.Instructor && (
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
            )}
          </Card>
        )}
      </Grid>
      <Grid container mt={2}>
        <ProblemComments problemUuid={props.problem?.uuid ?? ''} />
      </Grid>
    </Grid>
  )
}
