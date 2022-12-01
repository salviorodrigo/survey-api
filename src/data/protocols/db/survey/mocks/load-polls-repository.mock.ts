import { LoadPollsRepository } from '../load-polls-repository'
import { SurveyModel } from '@/domain/models'
import { mockSurveyModel } from '@/domain/models/mocks'

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
