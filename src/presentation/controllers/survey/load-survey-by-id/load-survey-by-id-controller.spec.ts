import { LoadSurveyByIdController } from './load-survey-by-id-controller'
import {
  HttpRequest,
  LoadSurveyById,
  SurveyAnswerOptionModel,
  SurveyModel
} from './load-survey-by-id-controller-protocols'
import MockDate from 'mockdate'
import { badRequest, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'

beforeAll(() => {
  MockDate.set(new Date())
})

afterAll(() => {
  MockDate.reset()
})

const makeFakeRequest = (): HttpRequest => ({
  body: {
    surveyId: 'valid_id'
  }
})

const makeFakeSurveyAnswerOptions = (): SurveyAnswerOptionModel[] => {
  return [{
    answer: 'any_answer',
    imagePath: 'https://image.path/locale.jpg'
  }, {
    answer: 'another_answer'
  }]
}

const makeFakeSurvey = (): SurveyModel => ({
  id: 'valid_id',
  question: 'any_question',
  answerOptions: makeFakeSurveyAnswerOptions(),
  date: new Date()
})

const makeLoadSurveyByIdStub = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel | null> {
      return await Promise.resolve(makeFakeSurvey())
    }
  }
  return new LoadSurveyByIdStub()
}

type SutTypes = {
  sut: LoadSurveyByIdController
  surveyLoaderStub: LoadSurveyById
}

const makeSut = (): SutTypes => {
  const surveyLoaderStub = makeLoadSurveyByIdStub()
  const sut = new LoadSurveyByIdController(surveyLoaderStub)
  return {
    sut,
    surveyLoaderStub
  }
}

describe('LoadSurveyById Controller', () => {
  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, surveyLoaderStub } = makeSut()
    const loadSpy = jest.spyOn(surveyLoaderStub, 'loadById')
    const fakeRequestData = makeFakeRequest()
    await sut.handle(fakeRequestData)

    expect(loadSpy).toHaveBeenCalledWith(fakeRequestData.body.surveyId)
  })

  test('Should returns a survey on success', async () => {
    const { sut } = makeSut()
    const thisResponse = await sut.handle(makeFakeRequest())

    expect(thisResponse).toEqual(ok(makeFakeSurvey()))
  })

  test('Should returns an error if LoadSurveyById returns null', async () => {
    const { sut, surveyLoaderStub } = makeSut()
    jest.spyOn(surveyLoaderStub, 'loadById').mockResolvedValueOnce(null)
    const thisResponse = await sut.handle(makeFakeRequest())

    expect(thisResponse).toEqual(badRequest(new InvalidParamError('surveyId')))
  })

  test('Should returns an serveError if LoadSurveyById throws', async () => {
    const { sut, surveyLoaderStub } = makeSut()
    jest.spyOn(surveyLoaderStub, 'loadById').mockRejectedValueOnce(new Error())
    const thisResponse = await sut.handle(makeFakeRequest())

    expect(thisResponse).toEqual(serverError(new Error()))
  })
})
