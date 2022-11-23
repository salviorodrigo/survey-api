import { LoadSurveyByIdController } from './load-survey-by-id-controller'
import {
  HttpRequest,
  LoadSurveyById,
  SurveyAnswerOptionModel,
  SurveyModel,
  Validator
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

const makeValidatorStub = (): Validator => {
  class ValidatorStub implements Validator {
    validate (input: any): Error | null {
      return null
    }
  }
  return new ValidatorStub()
}

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
  validatorStub: Validator
  surveyLoaderStub: LoadSurveyById
}

const makeSut = (): SutTypes => {
  const validatorStub = makeValidatorStub()
  const surveyLoaderStub = makeLoadSurveyByIdStub()
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
    expect(validateSyp).toHaveBeenCalledWith(httpRequest.body)
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

    expect(loadSpy).toHaveBeenCalledWith(fakeRequestData.body.surveyId)
  })

  test('Should returns 200 on success', async () => {
    const { sut } = makeSut()
    const thisResponse = await sut.handle(makeFakeRequest())

    expect(thisResponse).toEqual(ok(makeFakeSurvey()))
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
