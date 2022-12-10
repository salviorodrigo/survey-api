import { DbLoadSurveyAnswer } from './db-load-survey-answer'
import { mockSurveyAnswerModel, mockSurveyModel } from '@/domain/models/mocks'
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
    test('Should call LoadSurveyAnswer with correct values', async () => {
      const { sut, surveyAnswerLoaderStub } = makeSut()
      const loadSpy = jest.spyOn(surveyAnswerLoaderStub, 'loadAnswersBySurveyId')
      const fakeSurvey = mockSurveyModel()
      await sut.loadAnswersBySurveyId(fakeSurvey.id)
      expect(loadSpy).toHaveBeenCalledWith(fakeSurvey.id)
    })

    test('Should return SurveyAnswerModels on success', async () => {
      const { sut } = makeSut()
      const sutResponse = await sut.loadAnswersBySurveyId(mockSurveyModel().id)
      expect(sutResponse).toEqual([mockSurveyAnswerModel()])
    })

    test('Should throw if SurveyAnswerModels throws', async () => {
      const { sut, surveyAnswerLoaderStub } = makeSut()
      jest.spyOn(surveyAnswerLoaderStub, 'loadAnswersBySurveyId').mockRejectedValueOnce(new Error())
      const sutResponse = sut.loadAnswersBySurveyId(mockSurveyModel().id)
      await expect(sutResponse).rejects.toThrow()
    })
  })
})
