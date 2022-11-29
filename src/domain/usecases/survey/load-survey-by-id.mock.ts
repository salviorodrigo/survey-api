import { LoadSurveyById } from './load-survey-by-id'
import { SurveyModel, mockSurveyModel } from '@/domain/models'

export const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel> {
      return mockSurveyModel()
    }
  }
  return new LoadSurveyByIdStub()
}
