export type SurveyModel = {
  id: string
  closed: boolean
  question: string
  answerOptions: SurveyAnswerOptionModel[]
  userAnswer: SurveyAnswerOptionModel | null
  date: Date
}

export type SurveyAnswerOptionModel = {
  answer: string
  imagePath?: string
  answerCounter: number
}
