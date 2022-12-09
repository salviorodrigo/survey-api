import { SurveyAnswerOptionModel, SurveyModel } from '../survey'

export const mockSurveyAnswerOptionModel = (): SurveyAnswerOptionModel[] => ([{
  answer: 'any_answer',
  imagePath: 'any_image_path',
  answerCounter: 0
}, {
  answer: 'another_answer',
  answerCounter: 0
}
])

export const mockSurveyModel = (): SurveyModel => ({
  id: 'any_id',
  closed: false,
  question: 'any_question',
  answerOptions: mockSurveyAnswerOptionModel(),
  userAnswer: null,
  date: new Date()
})
