import { LoadSurveyById } from '../load-survey-by-id'
import { SurveyModel } from '@/domain/models'
import { mockSurveyModel } from '@/domain/models/mocks'

export const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel> {
      return mockSurveyModel()
    }
  }
  return new LoadSurveyByIdStub()
}
