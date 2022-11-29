import { mockSurveyModel, SurveyModel } from '@/domain/models'
import { LoadSurveyByIdRepository } from './load-survey-by-id-repository'

export const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (id: string): Promise<SurveyModel> {
      return await Promise.resolve(mockSurveyModel())
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}
