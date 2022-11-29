import { LoadPolls } from './load-polls'
import { SurveyModel, mockSurveyModel } from '@/domain/models'

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
