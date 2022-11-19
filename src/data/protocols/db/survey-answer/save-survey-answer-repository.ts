import { SaveSurveyAnswer, SaveSurveyAnswerModel } from '@/domain/usecases/save-survey-answer'

export interface SaveSurveyAnswerRepository {
  add (surveyAnswerData: SaveSurveyAnswer): Promise<SaveSurveyAnswerModel>
}
