import { SurveyModel } from '@/domain/models/survey'

export type AddSurveyParams = Omit<SurveyModel, 'id' | 'date'>

export interface AddSurvey {
  add (data: AddSurveyParams): Promise<void>
}
