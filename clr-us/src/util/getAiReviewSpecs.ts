import { AiChipSpecs, AiScoreClass } from '@/types/problem'

const classifyScore = (aiScore: number): AiScoreClass => {
  if (aiScore > 0 && aiScore <= 3) {
    return AiScoreClass.LowAttempt
  } else if (aiScore >= 4 && aiScore <= 6) {
    return AiScoreClass.MedAttempt
  } else if (aiScore > 6) {
    return AiScoreClass.HighAttempt
  }
  return AiScoreClass.MedAttempt
}

const getAiReviewSpecs = (aiScore: number): AiChipSpecs | null => {
  const scoreClass = classifyScore(aiScore)
  if (scoreClass == AiScoreClass.LowAttempt) {
    return { bgColor: '#fbb6b6', color: '#a21212', text: 'Low attempt' }
  } else if (scoreClass == AiScoreClass.MedAttempt) {
    return { bgColor: '#ffd991', color: '#b47e14', text: 'Medium attempt' }
  } else if (scoreClass == AiScoreClass.HighAttempt) {
    return { bgColor: '#c5eec9', color: '#1b5e20', text: 'Good attempt' }
  }
  return null
}

const getAiSeverity = (aiScore: number): 'success' | 'warning' | 'error' => {
  const scoreClass = classifyScore(aiScore)
  if (scoreClass == AiScoreClass.HighAttempt) {
    return 'success'
  } else if (scoreClass == AiScoreClass.MedAttempt) {
    return 'warning'
  } else if (scoreClass == AiScoreClass.LowAttempt) {
    return 'error'
  }
  return 'warning'
}

export { getAiReviewSpecs, getAiSeverity }
