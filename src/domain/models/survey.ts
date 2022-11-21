export type SurveyModel = {
  id: string
  question: string
  answerOptions: SurveyAnswerOptionModel[]
  date: Date
}

export type SurveyAnswerOptionModel = {
  answer: string
  imagePath?: string
}
