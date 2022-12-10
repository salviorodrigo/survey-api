import { SurveyAnswerModel } from '@/domain/models'

export interface LoadSurveyAnswer {
  loadAnswersBySurveyId (surveyId: string): Promise<SurveyAnswerModel[]>
}
