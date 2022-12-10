import { SurveyAnswerModel } from '@/domain/models'
import { mockSurveyAnswerModel } from '@/domain/models/mocks'
import { LoadSurveyAnswerRepository } from '../load-survey-answer-repository'

export const mockLoadSurveyAnswerRepository = (): LoadSurveyAnswerRepository => {
  class LoadSurveyAnswerRepositoryStub implements LoadSurveyAnswerRepository {
    async loadAnswersBySurveyId (surveyId: string): Promise<SurveyAnswerModel[]> {
      return await Promise.resolve([
        mockSurveyAnswerModel()
      ])
    }
  }
  return new LoadSurveyAnswerRepositoryStub()
}
