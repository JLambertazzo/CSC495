import LightbulbIcon from '@mui/icons-material/Lightbulb'
import { Chip } from '@mui/material'
import React from 'react'

export type SolutionAuthorsProps = {
  solutionAuthors: string[]
}

export const SolutionAuthorsChip: React.FC<SolutionAuthorsProps> = (props) => {
  if (props.solutionAuthors.length < 1) {
    return <></>
  }
  return (
    <Chip
      sx={{ background: '#e7f2ff', color: '#022D6D', alignSelf: 'flex-start' }}
      icon={<LightbulbIcon style={{ color: '#022D6D' }} />}
      label={`By ${props.solutionAuthors.join(', ')}`}
    />
  )
}
