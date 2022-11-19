import { SurveyAnswerModel } from '@/domain/models/survey-answer'
import { SaveSurveyAnswerModel } from '@/domain/usecases/save-survey-answer'

export interface SaveSurveyAnswerRepository {
  save (surveyAnswerData: SaveSurveyAnswerModel): Promise<SurveyAnswerModel>
}
