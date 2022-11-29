import { SurveyAnswerOptionModel, SurveyModel } from './survey'

export const mockSurveyAnswerOptionModel = (): SurveyAnswerOptionModel[] => ([{
  answer: 'any_answer',
  imagePath: 'any_image_path'
}, {
  answer: 'another_answer'
}
])

export const mockSurveyModel = (): SurveyModel => ({
  id: 'any_id',
  question: 'any_question',
  answerOptions: mockSurveyAnswerOptionModel(),
  date: new Date()
})
