import { AddSurvey, AddSurveyParams } from '../add-survey'
import { mockSurveyAnswerOptionModel } from '@/domain/models/mocks'

export const mockAddSurveyParams = (): AddSurveyParams => ({
  question: 'any_question',
  answerOptions: mockSurveyAnswerOptionModel()
})

export const mockAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (data: AddSurveyParams): Promise<void> {}
  }
  return new AddSurveyStub()
}
