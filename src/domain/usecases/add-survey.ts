export type AddSurveyModel = {
  question: string
  date: Date
}

export interface AddSurvey {
  add (data: AddSurveyModel): Promise<void>
}
