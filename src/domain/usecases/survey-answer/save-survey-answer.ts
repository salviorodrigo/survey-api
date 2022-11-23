import { SurveyAnswerModel } from '@/domain/models/survey-answer'

export type SaveSurveyAnswerModel = Omit<SurveyAnswerModel, 'id' | 'date'>

export interface SaveSurveyAnswer {
  save (data: SaveSurveyAnswerModel): Promise<SurveyAnswerModel>
}
