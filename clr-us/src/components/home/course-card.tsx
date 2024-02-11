import { CardActionArea } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'

import { ICourse } from '@/types'

export const CourseCard = (props: { course: ICourse }) => {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate(`/${props.course.oid}/learn`)
  }

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardActionArea onClick={handleClick}>
        <CardContent>
          <Typography variant="h5" component="div" sx={{ textTransform: 'uppercase' }}>
            {props.course.code}
          </Typography>
          <Typography sx={{ mb: 1.5, textTransform: 'capitalize' }} color="text.secondary">
            {props.course.role}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
