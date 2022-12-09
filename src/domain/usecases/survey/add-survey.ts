import { SurveyModel } from '@/domain/models/survey'

export type AddSurveyParams = Pick<SurveyModel, 'question' | 'answerOptions'>

export interface AddSurvey {
  add (data: AddSurveyParams): Promise<void>
}
