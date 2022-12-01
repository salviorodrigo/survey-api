import { LoadSurveyByIdRepository } from '../load-survey-by-id-repository'
import { SurveyModel } from '@/domain/models'
import { mockSurveyModel } from '@/domain/models/mocks'

export const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (id: string): Promise<SurveyModel> {
      return await Promise.resolve(mockSurveyModel())
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}
