import { SaveSurveyAnswerRepository } from '../save-survey-answer-repository'
import { SaveSurveyAnswerParams } from '@/domain/usecases/survey-answer'
import { SurveyAnswerModel } from '@/domain/models'
import { mockSurveyAnswerModel } from '@/domain/models/mocks'

export const mockSaveSurveyAnswerRepository = (): SaveSurveyAnswerRepository => {
  class SaveSurveyAnswerRepositoryStub implements SaveSurveyAnswerRepository {
    async save (surveyAnswerData: SaveSurveyAnswerParams): Promise<SurveyAnswerModel> {
      return await Promise.resolve(mockSurveyAnswerModel())
    }
  }
  return new SaveSurveyAnswerRepositoryStub()
}
