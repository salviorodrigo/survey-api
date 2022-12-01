import { AddSurveyController } from './add-survey-controller'
import {
  Validator,
  HttpRequest,
  AddSurvey
} from './add-survey-controller-protocols'
import {
  badRequest,
  serverError,
  noContent
} from '@/presentation/helpers/http/http-helper'
import { mockAddSurvey, mockAddSurveyParams } from '@/domain/usecases/survey/mocks'
import { mockValidator } from '@/presentation/protocols/mocks'
import MockDate from 'mockdate'

beforeAll(() => {
  MockDate.set(new Date())
})

afterAll(() => {
  MockDate.reset()
})

const makeFakeRequest = (): HttpRequest => ({
  body: Object.assign({}, mockAddSurveyParams())
})

type SutTypes = {
  sut: AddSurveyController
  validatorStub: Validator
  addSurveyStub: AddSurvey
}

const makeSut = (): SutTypes => {
  const validatorStub = mockValidator()
  const surveyAdderStub = mockAddSurvey()
  const sut = new AddSurveyController(validatorStub, surveyAdderStub)
  return {
    sut,
    validatorStub,
    addSurveyStub: surveyAdderStub
  }
}

describe('AddSurvey Controller', () => {
  test('Should call Validator with correct values', async () => {
    const { sut, validatorStub } = makeSut()
    const validateSyp = jest.spyOn(validatorStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSyp).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validator fails', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(new Error())
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  test('Should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut()
    const addSyp = jest.spyOn(addSurveyStub, 'add')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(addSyp).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 500 if AddSurvey throws', async () => {
    const { sut, addSurveyStub } = makeSut()
    jest.spyOn(addSurveyStub, 'add').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(noContent())
  })
})
