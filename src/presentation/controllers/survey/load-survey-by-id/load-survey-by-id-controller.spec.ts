import { LoadSurveyByIdController } from './load-survey-by-id-controller'
import {
  HttpRequest,
  LoadSurveyById,
  Validator
} from './load-survey-by-id-controller-protocols'
import { mockLoadSurveyById } from '@/domain/usecases/survey/mocks'
import { mockSurveyModel } from '@/domain/models/mocks'
import { mockValidator } from '@/presentation/protocols/mocks'
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
  params: {
    surveyId: 'valid_id'
  }
})

type SutTypes = {
  sut: LoadSurveyByIdController
  validatorStub: Validator
  surveyLoaderStub: LoadSurveyById
}

const makeSut = (): SutTypes => {
  const validatorStub = mockValidator()
  const surveyLoaderStub = mockLoadSurveyById()
  const sut = new LoadSurveyByIdController(surveyLoaderStub, validatorStub)
  return {
    sut,
    validatorStub,
    surveyLoaderStub
  }
}

describe('LoadSurveyById Controller', () => {
  test('Should call Validator with correct values', async () => {
    const { sut, validatorStub } = makeSut()
    const validateSyp = jest.spyOn(validatorStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSyp).toHaveBeenCalledWith(httpRequest.params)
  })

  test('Should return 400 if Validator fails', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(new Error())
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, surveyLoaderStub } = makeSut()
    const loadSpy = jest.spyOn(surveyLoaderStub, 'loadById')
    const fakeRequestData = makeFakeRequest()
    await sut.handle(fakeRequestData)

    expect(loadSpy).toHaveBeenCalledWith(fakeRequestData.params.surveyId)
  })

  test('Should returns 200 on success', async () => {
    const { sut } = makeSut()
    const thisResponse = await sut.handle(makeFakeRequest())

    expect(thisResponse).toEqual(ok(mockSurveyModel()))
  })

  test('Should returns 400 if LoadSurveyById returns null', async () => {
    const { sut, surveyLoaderStub } = makeSut()
    jest.spyOn(surveyLoaderStub, 'loadById').mockResolvedValueOnce(null)
    const thisResponse = await sut.handle(makeFakeRequest())

    expect(thisResponse).toEqual(badRequest(new InvalidParamError('surveyId')))
  })

  test('Should returns an 500 if LoadSurveyById throws', async () => {
    const { sut, surveyLoaderStub } = makeSut()
    jest.spyOn(surveyLoaderStub, 'loadById').mockRejectedValueOnce(new Error())
    const thisResponse = await sut.handle(makeFakeRequest())

    expect(thisResponse).toEqual(serverError(new Error()))
  })
})
