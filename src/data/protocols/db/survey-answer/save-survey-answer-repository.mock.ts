import { SaveSurveyAnswerRepository } from './save-survey-answer-repository'
import { mockSurveyAnswerModel, SurveyAnswerModel } from '@/domain/models'
import { SaveSurveyAnswerParams } from '@/domain/usecases/survey-answer'

export const mockSaveSurveyAnswerRepository = (): SaveSurveyAnswerRepository => {
  class SaveSurveyAnswerRepositoryStub implements SaveSurveyAnswerRepository {
    async save (surveyAnswerData: SaveSurveyAnswerParams): Promise<SurveyAnswerModel> {
      return await Promise.resolve(mockSurveyAnswerModel())
    }
  }
  return new SaveSurveyAnswerRepositoryStub()
}
