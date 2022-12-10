import { SurveyAnswerModel } from '@/domain/models/survey-answer'

export interface LoadSurveyAnswerRepository {
  loadAnswersBySurveyId (surveyId: string): Promise<SurveyAnswerModel[]>
}
