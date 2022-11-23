import { SaveSurveyAnswerController } from './save-survey-answer-controller'
import {
  LoadSurveyById,
  HttpRequest,
  SurveyAnswerOptionModel,
  SurveyModel,
  Validator
} from './save-survey-answer-controller-protocols'
import { badRequest, serverError } from '@/presentation/helpers/http/http-helper'
import MockDate from 'mockdate'
import { InvalidParamError } from '@/presentation/errors'

beforeAll(() => {
  MockDate.set(new Date())
})

afterAll(() => {
  MockDate.reset()
})

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'valid_surveyId',
    accountId: 'account',
    answer: 'any_answer'
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
  sut: SaveSurveyAnswerController
  validatorStub: Validator
  surveyLoaderByIdStub: LoadSurveyById
}

const makeSut = (): SutTypes => {
  const validatorStub = makeValidatorStub()
  const surveyLoaderByIdStub = makeLoadSurveyByIdStub()
  const sut = new SaveSurveyAnswerController(surveyLoaderByIdStub, validatorStub)
  return {
    sut,
    validatorStub,
    surveyLoaderByIdStub
  }
}

describe('SaveSurveyAnswer Controller', () => {
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
})
