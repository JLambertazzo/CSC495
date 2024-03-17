import { Button, Divider, Grid, TextField, Typography } from '@mui/material'
import { Field, FieldProps, Form, Formik, FormikHelpers } from 'formik'
import React, { useCallback, useEffect, useState } from 'react'
import * as Yup from 'yup'

import { UserAvatar } from '@/components/avatar/user-avatar'
import { CommentCard } from '@/components/course-page/comments/comment-card'
import { commentService } from '@/components/course-page/comments/comment.service'
import { TextEditor } from '@/components/text-editor/text-editor'
import useAuth from '@/context/context'
import { useNotification } from '@/hooks/useNotification'

import { Comment, IPostComment } from './type'

export const ProblemComments = (props: { problemId: string }) => {
  const [comments, setComments] = useState<Comment[]>([])
  const [isEditing, setIsEditing] = useState(false)

  const { user } = useAuth()
  const notify = useNotification()

  const [initialValues] = useState({
    author: user?.username || '',
    body: '',
    replyTo: undefined,
    commentOn: props.problemId,
  } as IPostComment)

  const fetchComments = useCallback(
    () => commentService.getComments(props.problemId).then((res) => setComments(res)),
    [props.problemId]
  )

  useEffect(() => {
    if (props.problemId) {
      fetchComments().then()
    }
  }, [fetchComments, props.problemId])

  const handleDeleteComment = useCallback(
    async (commentId: string) => {
      await commentService.deleteComment(commentId).then(() => {
        fetchComments().then()
        notify({
          message: 'Success! Your comment was deleted.',
          severity: 'success',
        })
      })
    },
    [fetchComments, notify]
  )

  const handleSubmit = useCallback(
    async (values: IPostComment, helpers: FormikHelpers<IPostComment>) => {
      helpers.setSubmitting(true)
      await commentService
        .postComment({
          ...values,
          commentOn: props.problemId,
        })
        .then(() => {
          helpers.setSubmitting(false)
          setIsEditing(false)
          helpers.resetForm()
          fetchComments().then()
        })
    },
    [fetchComments, props.problemId]
  )

  const validationSchema = Yup.object().shape({
    author: Yup.string().required('User is required'),
    body: Yup.string().required('Comment body is required'),
  })

  return (
    <Grid container gap={2}>
      <Typography variant={'h5'}>Comments</Typography>
      <Grid container sx={{ background: 'white', p: 3, borderRadius: 2 }}>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          onSubmit={(values, formikHelpers) => handleSubmit(values, formikHelpers)}
          validationSchema={validationSchema}
        >
          {({ resetForm, isSubmitting }) => (
            <Form style={{ width: '100%' }}>
              <Grid
                container
                alignItems={'baseline'}
                gap={2.5}
                flexWrap={'nowrap'}
                width={'60%'}
                marginBottom={5}
                minHeight={comments.length ? 0 : 400}
              >
                <UserAvatar />
                {isEditing ? (
                  <Grid container gap={12}>
                    <Field name="body">
                      {({ field }: FieldProps) => (
                        <TextEditor value={field.value} onChange={field.onChange(field.name)} />
                      )}
                    </Field>
                    <Grid container gap={1}>
                      <Button variant="contained" type={'submit'} disabled={isSubmitting}>
                        Post
                      </Button>
                      <Button
                        onClick={() => {
                          setIsEditing(false)
                          resetForm()
                        }}
                      >
                        Cancel
                      </Button>
                    </Grid>
                  </Grid>
                ) : (
                  <TextField
                    fullWidth
                    label="Add a comment..."
                    variant="standard"
                    onFocus={() => setIsEditing(true)}
                  />
                )}
              </Grid>
            </Form>
          )}
        </Formik>
        <Grid container gap={2}>
          {comments.map((comment, index) => (
            <Grid container gap={2} direction="column" key={comment.id}>
              <CommentCard
                author={comment.author}
                body={comment.body}
                commentId={comment.id}
                handleDelete={handleDeleteComment}
              />
              {index < comments.length - 1 && <Divider />}
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  )
}
