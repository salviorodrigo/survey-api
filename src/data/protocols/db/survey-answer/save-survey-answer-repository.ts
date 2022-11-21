import { SurveyAnswerModel } from '@/domain/models/survey-answer'
import { SaveSurveyAnswerModel } from '@/domain/usecases/survey-answer/save-survey-answer'

export interface SaveSurveyAnswerRepository {
  save (surveyAnswerData: SaveSurveyAnswerModel): Promise<SurveyAnswerModel>
}
