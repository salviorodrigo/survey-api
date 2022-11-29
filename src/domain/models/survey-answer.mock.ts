import { SurveyAnswerModel } from './survey-answer'

export const mockSurveyAnswerModel = (): SurveyAnswerModel => ({
  id: 'any_id',
  surveyId: 'any_surveyId',
  accountId: 'any_accountId',
  answer: 'any_answer',
  date: new Date()
})
