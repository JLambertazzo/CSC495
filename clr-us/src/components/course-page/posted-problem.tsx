import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import EditIcon from '@mui/icons-material/Edit'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import { Button, Card, CardActions, CardContent, Chip, Grid, Typography } from '@mui/material'
import { Formik, Form, Field, FieldProps, ErrorMessage } from 'formik'
import parse from 'html-react-parser'
import React, { useCallback, useEffect, useState } from 'react'
import 'react-quill/dist/quill.snow.css'
import { useLocation, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

import { ProblemComments } from '@/components/course-page/comments'
import useAuth from '@/context/context'
import { ProblemType } from '@/enum'
import { useCourseCheck, useUserRole } from '@/hooks'
import { useNotification } from '@/hooks/useNotification'
import { IUser, PullRequest, UserRoles } from '@/types'
import { Problem } from '@/types/problem'
import { navigateUp } from '@/util'

import { TextEditor } from '../text-editor/text-editor'

import { PrModal } from './pr-modal'
import { problemService } from './problem.service'
import { pullRequestService } from './pullrequest.service'
import { IPREdit } from './type'

const SolutionEditor = (props: {
  problem?: Problem
  user: IUser | null
  closeEditor: VoidFunction
  forceRefresh: VoidFunction
  setPr: React.Dispatch<React.SetStateAction<PullRequest[] | null>>
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
          await pullRequestService.getPullRequests(props.problem?.uuid ?? '', props.setPr)
          props.forceRefresh()
          notify({
            message: 'Success! Your suggestion has been posted and is up for review.',
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

export const PostedProblem = (props: {
  problemType: ProblemType
  problem?: Problem
  forceRefresh: VoidFunction
}) => {
  useCourseCheck()
  const navigate = useNavigate()
  const location = useLocation()
  const notify = useNotification()
  const { user } = useAuth()
  const [editing, setEditing] = useState(false)
  const [prs, setPrs] = useState<PullRequest[] | null>(null)
  const [solutionAuthors, setSolutionAuthors] = useState([])
  const role = useUserRole()

  useEffect(() => {
    if (props.problem) {
      pullRequestService.getPullRequests(props.problem.uuid, setPrs)
      problemService.getSolutionAuthors(props.problem.uuid).then((res) => setSolutionAuthors(res))
    }
  }, [props.problem])

  const endorse = () =>
    problemService
      .endorseProblem(props.problem?.id ?? '')
      .then(() => {
        notify({
          message: 'Success! Solution has been endorsed.',
          severity: 'success',
        })
        navigate(navigateUp(location.pathname, 1))
      })
      .catch(() => console.log('An unknown error has occurred'))

  return (
    <Grid p={5} width={'70vw'}>
      <Typography textTransform={'capitalize'} variant={'h4'}>
        {props.problemType} Problem
      </Typography>
      <Grid container py={3} direction={'column'} gap={2} width={'100%'}>
        <Typography variant="h6">{props.problem?.title}</Typography>
        <Chip
          sx={{ background: '#e7f2ff', color: '#022D6D', alignSelf: 'flex-start' }}
          icon={<AccountCircleIcon style={{ color: '#022D6D' }} />}
          label={props.problem?.author ?? ''}
        />
        <Card sx={{ p: 2 }}>{parse(props.problem?.body ?? '')}</Card>
      </Grid>
      <Grid container direction={'column'} gap={2} width={'100%'} mt={5}>
        <Typography variant={'h5'}>Solution</Typography>
        {prs && <PrModal prs={prs} setPr={setPrs} forceRefresh={props.forceRefresh} />}
        <Chip
          sx={{ background: '#e7f2ff', color: '#022D6D', alignSelf: 'flex-start' }}
          icon={<LightbulbIcon style={{ color: '#022D6D' }} />}
          label={`By ${solutionAuthors.join(', ')}`}
        />
        {editing ? (
          <SolutionEditor
            problem={props.problem}
            user={user}
            closeEditor={() => setEditing(false)}
            forceRefresh={props.forceRefresh}
            setPr={setPrs}
          />
        ) : (
          <Card sx={{ p: 2 }}>
            <CardContent>{parse(props.problem?.solution ?? '')}</CardContent>
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
      <Grid>
        {role === UserRoles.Instructor && (
          <Grid>
            <Button onClick={endorse} variant={'contained'} sx={{ mr: 1, mt: 2 }}>
              Endorse
            </Button>
          </Grid>
        )}
        <Grid container mt={2}>
          <ProblemComments problemUuid={props.problem?.uuid ?? ''} />
        </Grid>
      </Grid>
    </Grid>
  )
}
