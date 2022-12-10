import { DbLoadSurveyAnswer } from './db-load-survey-answer'
import { mockSurveyModel } from '@/domain/models/mocks'
import { LoadSurveyAnswerRepository } from '@/data/protocols/db/survey-answer'
import { mockLoadSurveyAnswerRepository } from '@/data/protocols/db/survey-answer/mocks'

type SutTypes = {
  sut: DbLoadSurveyAnswer
  surveyAnswerLoaderStub: LoadSurveyAnswerRepository
}

const makeSut = (): SutTypes => {
  const surveyAnswerLoaderStub = mockLoadSurveyAnswerRepository()
  const sut = new DbLoadSurveyAnswer(surveyAnswerLoaderStub)
  return {
    sut,
    surveyAnswerLoaderStub
  }
}

describe('DbLoadSurveyAnswers Usecase', () => {
  describe('loadAnswersBySurveyId', () => {
    test('Should call LoadSurveyAnswer with correct values ', async () => {
      const { sut, surveyAnswerLoaderStub } = makeSut()
      const loadSpy = jest.spyOn(surveyAnswerLoaderStub, 'loadAnswersBySurveyId')
      const fakeSurvey = mockSurveyModel()
      await sut.loadAnswersBySurveyId(fakeSurvey.id)
      expect(loadSpy).toHaveBeenCalledWith(fakeSurvey.id)
    })
  })
})
