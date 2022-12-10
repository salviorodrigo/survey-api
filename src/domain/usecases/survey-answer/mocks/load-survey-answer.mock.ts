import { LoadSurveyAnswer } from '../load-survey-answer'
import { mockSurveyAnswerModel } from '@/domain/models/mocks'
import { SurveyAnswerModel } from '@/domain/models/survey-answer'

export const mockLoadSurveyAnswers = (): LoadSurveyAnswer => {
  class LoadSurveyAnswersStub implements LoadSurveyAnswer {
    async loadAnswersBySurveyId (surveyId: string): Promise<SurveyAnswerModel[]> {
      return await Promise.resolve([
        mockSurveyAnswerModel()
      ])
    }
  }
  return new LoadSurveyAnswersStub()
}
