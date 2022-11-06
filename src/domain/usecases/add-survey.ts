export interface AddSurveyModel {
  question: string
  answers: SurveyAnswer[]
}

export interface SurveyAnswer {
  image: string
  answer: SurveyAnswer[]
}

export interface AddSurvey {
  add (data: AddSurveyModel): Promise<void>
}
