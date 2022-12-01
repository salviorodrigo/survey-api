import { LoadPolls } from '../load-polls'
import { SurveyModel } from '@/domain/models'
import { mockSurveyModel } from '@/domain/models/mocks'

export const mockLoadPolls = (): LoadPolls => {
  class LoadPollsStub implements LoadPolls {
    async load (): Promise<SurveyModel[]> {
      return [
        mockSurveyModel(),
        mockSurveyModel()
      ]
    }
  }
  return new LoadPollsStub()
}
