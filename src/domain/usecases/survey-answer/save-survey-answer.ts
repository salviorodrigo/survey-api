import { SurveyAnswerModel } from '@/domain/models/survey-answer'

export type SaveSurveyAnswerParams = Omit<SurveyAnswerModel, 'id' | 'date'>

export interface SaveSurveyAnswer {
  save (data: SaveSurveyAnswerParams): Promise<SurveyAnswerModel>
}
