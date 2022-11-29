import { SaveSurveyAnswerController } from './save-survey-answer-controller'
import {
  LoadSurveyById,
  HttpRequest,
  Validator,
  SaveSurveyAnswer
} from './save-survey-answer-controller-protocols'
import { mockLoadSurveyById } from '@/domain/usecases/survey'
import { mockSaveSurveyAnswer, mockSaveSurveyAnswerParams } from '@/domain/usecases/survey-answer'
import { mockSurveyAnswerModel } from '@/domain/models'
import { mockValidator } from '@/presentation/protocols'
import { badRequest, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'
import MockDate from 'mockdate'

beforeAll(() => {
  MockDate.set(new Date())
})

afterAll(() => {
  MockDate.reset()
})

const makeFakeRequest = (): HttpRequest => ({
  accountId: 'any_accountId',
  params: {
    surveyId: 'any_surveyId'
  },
  body: {
    answer: 'any_answer'
  }
})

type SutTypes = {
  sut: SaveSurveyAnswerController
  validatorStub: Validator
  surveyLoaderByIdStub: LoadSurveyById
  surveyAnswerSaverStub: SaveSurveyAnswer
}

const makeSut = (): SutTypes => {
  const surveyLoaderByIdStub = mockLoadSurveyById()
  const validatorStub = mockValidator()
  const surveyAnswerSaverStub = mockSaveSurveyAnswer()
  const sut = new SaveSurveyAnswerController(surveyLoaderByIdStub, validatorStub, surveyAnswerSaverStub)
  return {
    sut,
    validatorStub,
    surveyLoaderByIdStub,
    surveyAnswerSaverStub
  }
}

describe('SaveSurveyAnswer Controller', () => {
  test('Should call Validator with correct values', async () => {
    const { sut, validatorStub } = makeSut()
    const validateSyp = jest.spyOn(validatorStub, 'validate')
    const httpRequest = makeFakeRequest()
    const params = Object.assign({}, httpRequest.params, httpRequest.body, { accountId: httpRequest.accountId })
    await sut.handle(httpRequest)
    expect(validateSyp).toHaveBeenCalledWith(params)
  })

  test('Should return 400 if Validator fails', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(new Error())
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, surveyLoaderByIdStub } = makeSut()
    const loadSpy = jest.spyOn(surveyLoaderByIdStub, 'loadById')
    const fakeRequest = makeFakeRequest()
    await sut.handle(fakeRequest)
    expect(loadSpy).toHaveBeenCalledWith(fakeRequest.params.surveyId)
  })

  test('Should returns 400 if LoadSurveyById returns null', async () => {
    const { sut, surveyLoaderByIdStub } = makeSut()
    jest.spyOn(surveyLoaderByIdStub, 'loadById').mockResolvedValueOnce(null)
    const fakeRequest = makeFakeRequest()
    const thisResponse = await sut.handle(fakeRequest)
    expect(thisResponse).toEqual(badRequest(new InvalidParamError('surveyId')))
  })

  test('Should returns 500 if LoadSurveyById throws', async () => {
    const { sut, surveyLoaderByIdStub } = makeSut()
    jest.spyOn(surveyLoaderByIdStub, 'loadById').mockRejectedValueOnce(new Error())
    const fakeRequest = makeFakeRequest()
    const thisResponse = await sut.handle(fakeRequest)
    expect(thisResponse).toEqual(serverError(new Error()))
  })

  test('Should returns 400 if an invalid answer is provided', async () => {
    const { sut } = makeSut()
    const fakeRequest = makeFakeRequest()
    fakeRequest.body = Object.assign({}, fakeRequest.body, { answer: 'invalid_answer' })
    const thisResponse = await sut.handle(fakeRequest)
    expect(thisResponse).toEqual(badRequest(new InvalidParamError('answer')))
  })

  test('Should call SaveSurveyAnswer with correct values', async () => {
    const { sut, surveyAnswerSaverStub } = makeSut()
    const loadSpy = jest.spyOn(surveyAnswerSaverStub, 'save')
    await sut.handle(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith(mockSaveSurveyAnswerParams())
  })

  test('Should returns 500 if SaveSurveyAnswer throws', async () => {
    const { sut, surveyAnswerSaverStub } = makeSut()
    jest.spyOn(surveyAnswerSaverStub, 'save').mockRejectedValueOnce(new Error())
    const fakeRequest = makeFakeRequest()
    const thisResponse = await sut.handle(fakeRequest)
    expect(thisResponse).toEqual(serverError(new Error()))
  })

  test('Should returns 200 on success', async () => {
    const { sut } = makeSut()
    const fakeRequest = makeFakeRequest()
    const thisResponse = await sut.handle(fakeRequest)
    expect(thisResponse).toEqual(ok(mockSurveyAnswerModel()))
  })
})
