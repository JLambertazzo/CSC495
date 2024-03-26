import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { Chip } from '@mui/material'
import React from 'react'

export type ProblemAuthorProps = {
  solutionAuthors: string[]
}

export const ProblemAuthorChip: React.FC<ProblemAuthorProps> = (props) => {
  if (props.solutionAuthors.length < 1) {
    return <></>
  }
  return (
    <Chip
      sx={{ background: '#e7f2ff', color: '#022D6D', alignSelf: 'flex-start' }}
      icon={<AccountCircleIcon style={{ color: '#022D6D' }} />}
      label={props.solutionAuthors[0]}
    />
  )
}
