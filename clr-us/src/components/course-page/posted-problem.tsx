import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import EditIcon from '@mui/icons-material/Edit'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import { Button, Card, CardActions, CardContent, Chip, Grid, Typography } from '@mui/material'
import { Formik, Form, Field, FieldProps, ErrorMessage } from 'formik'
import parse from 'html-react-parser'
import React, { useCallback, useEffect, useState } from 'react'
import 'react-quill/dist/quill.snow.css'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

import { ProblemComments } from '@/components/course-page/comments'
import useAuth from '@/context/context'
import { ProblemType } from '@/enum'
import { useCourseCheck } from '@/hooks'
import { useNotification } from '@/hooks/useNotification'
import { IUser, PullRequest } from '@/types'
import { Problem } from '@/types/problem'

import { TextEditor } from '../text-editor/text-editor'

import { PrModal } from './pr-modal'
import { problemService } from './problem.service'
import { pullRequestService } from './pullrequest.service'
import { IPREdit } from './type'

const SolutionEditor = (props: {
  problem?: Problem
  user: IUser | null
  closeEditor: VoidFunction
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
        .postPullRequest(props.problem?.id ?? '', values.solution, values.author)
        .then(async () => {
          props.closeEditor()
          await pullRequestService.getPullRequests(props.problem?.id ?? '', props.setPr)
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

export const PostedProblem = (props: { problemType: ProblemType; problem?: Problem }) => {
  useCourseCheck()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [editing, setEditing] = useState(false)
  const [prs, setPrs] = useState<PullRequest[] | null>(null)

  useEffect(() => {
    if (props.problem) {
      pullRequestService.getPullRequests(props.problem.id, setPrs)
    }
  }, [props.problem])

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
        {prs && <PrModal prs={prs} setPr={setPrs} />}
        <Chip
          sx={{ background: '#e7f2ff', color: '#022D6D', alignSelf: 'flex-start' }}
          icon={<LightbulbIcon style={{ color: '#022D6D' }} />}
          label={`By ${props.problem?.author ?? ''}`}
        />
        {/*<Typography color={'#B0B0B0'}>The student submitted the following solution.</Typography>*/}
        {editing ? (
          <SolutionEditor
            problem={props.problem}
            user={user}
            closeEditor={() => setEditing(false)}
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
        <Grid container mt={2}>
          <ProblemComments problemId={props.problem?.id ?? ''} />
        </Grid>
      </Grid>
      <Grid>
        <Button
          onClick={problemService.endorseProblem(navigate, props.problem?.id ?? '')}
          variant={'contained'}
          sx={{ mr: 1, mt: 2 }}
        >
          Endorse
        </Button>
      </Grid>
    </Grid>
  )
}
