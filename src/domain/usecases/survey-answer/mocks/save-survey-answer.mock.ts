import { SaveSurveyAnswer, SaveSurveyAnswerParams } from '../save-survey-answer'
import { mockSurveyAnswerModel } from '@/domain/models/mocks'
import { SurveyAnswerModel } from '@/domain/models/survey-answer'

export const mockSaveSurveyAnswerParams = (): SaveSurveyAnswerParams => ({
  surveyId: 'any_surveyId',
  accountId: 'any_accountId',
  answer: 'any_answer'
})

export const mockSaveSurveyAnswer = (): SaveSurveyAnswer => {
  class SaveSurveyAnswerStub implements SaveSurveyAnswer {
    async save (data: SaveSurveyAnswerParams): Promise<SurveyAnswerModel | null> {
      return mockSurveyAnswerModel()
    }
  }
  return new SaveSurveyAnswerStub()
}
