import { LoadPollsRepository } from './load-polls-repository'
import { mockSurveyModel, SurveyModel } from '@/domain/models'

export const mockLoadPollsRepository = (): LoadPollsRepository => {
  class LoadPollsRepositoryStub implements LoadPollsRepository {
    async loadAll (): Promise<SurveyModel[]> {
      return await Promise.resolve([
        mockSurveyModel(),
        mockSurveyModel()
      ])
    }
  }
  return new LoadPollsRepositoryStub()
}
