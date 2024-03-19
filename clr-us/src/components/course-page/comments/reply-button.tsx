import { Button, Grid } from '@mui/material'
import { Field, Form, Formik, FieldProps, FormikHelpers } from 'formik'
import React, { useCallback, useState } from 'react'
import * as Yup from 'yup'

import { commentService } from '@/components/course-page/comments/comment.service'
import { TextEditor } from '@/components/text-editor/text-editor'
import useAuth from '@/context/context'

import { IPostComment } from './type'

export const ReplyButton: React.FC<{
  originalCommentId: string
  problemId: string
  fetchComments: () => Promise<void>
}> = ({ originalCommentId, problemId, fetchComments }) => {
  const [isReplying, setIsReplying] = useState(false)

  const { user } = useAuth()

  const [initialValues] = useState({
    author: user?.username || '',
    body: '',
    replyTo: originalCommentId,
    commentOn: problemId,
  } as IPostComment)

  const validationSchema = Yup.object().shape({
    author: Yup.string().required('User is required'),
    body: Yup.string().required('Comment body is required'),
  })

  const handleSubmit = useCallback(
    async (values: IPostComment, helpers: FormikHelpers<IPostComment>) => {
      helpers.setSubmitting(true)
      await commentService
        .postComment({
          ...values,
          numReplies: 0,
        })
        .then(() => {
          helpers.setSubmitting(false)
          setIsReplying(false)
          helpers.resetForm()
          fetchComments().then()
        })
    },
    [fetchComments]
  )

  return (
    <>
      <Button
        sx={{ alignSelf: 'flex-start' }}
        size={'small'}
        variant={'text'}
        onClick={() => setIsReplying(true)}
      >
        Reply
      </Button>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={(values, formikHelpers) => handleSubmit(values, formikHelpers)}
        validationSchema={validationSchema}
      >
        {({ resetForm, isSubmitting }) => (
          <Form style={{ width: '100%' }}>
            {isReplying && (
              <Grid container gap={12} sx={{ mt: 2 }}>
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
                      setIsReplying(false)
                      resetForm()
                    }}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            )}
          </Form>
        )}
      </Formik>
    </>
  )
}
