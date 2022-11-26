import { SurveyAnswerModel } from '@/domain/models/survey-answer'
import { SaveSurveyAnswerParams } from '@/domain/usecases/survey-answer/save-survey-answer'

export interface SaveSurveyAnswerRepository {
  save (surveyAnswerData: SaveSurveyAnswerParams): Promise<SurveyAnswerModel>
}
