import BoltIcon from '@mui/icons-material/Bolt'
import { Card, Chip, ListItem, Stack, Typography } from '@mui/material'
import parse from 'html-react-parser'
import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'

import { ProblemStatus } from '@/enum'
import { theme } from '@/themes/theme'
import { Problem } from '@/types/problem'
import { getAiReviewSpecs } from '@/util'

export const ProblemCard = (props: { problem: Problem }) => {
  const aiChipInfo = useMemo(
    () =>
      props.problem.status == ProblemStatus.Review && props.problem.aiReview
        ? getAiReviewSpecs(props.problem.aiReview.aiScore)
        : null,
    [props.problem]
  )
  return (
    <ListItem>
      <Card sx={{ p: 3, width: '100%' }}>
        <Stack direction={'row'} justifyContent={'space-between'}>
          <Link
            to={props.problem.id}
            style={{ textDecoration: 'none', color: theme.palette.primary.main }}
          >
            <Typography variant="h6">{props.problem.title}</Typography>
          </Link>
          {aiChipInfo && (
            <Chip
              icon={<BoltIcon style={{ color: aiChipInfo.color }} />}
              label={aiChipInfo.text}
              sx={{
                color: aiChipInfo.color,
                background: aiChipInfo.bgColor,
              }}
            />
          )}
        </Stack>
        <Typography variant="caption">Last Edit by {props.problem.author}</Typography>
        <br />
        <Typography variant="body1">{parse(props.problem.body)}</Typography>
      </Card>
    </ListItem>
  )
}
