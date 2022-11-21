import { AddSurveyController } from './add-survey-controller'
import {
  Validator,
  HttpRequest,
  AddSurvey,
  AddSurveyModel,
  SurveyAnswerOptionModel
} from './add-survey-controller-protocols'
import { badRequest, serverError, noContent } from '@/presentation/helpers/http/http-helper'
import MockDate from 'mockdate'

beforeAll(() => {
  MockDate.set(new Date())
})

afterAll(() => {
  MockDate.reset()
})

const makeFakeSurveyAnswerOptions = (): SurveyAnswerOptionModel[] => {
  return [{
    answer: 'any_answer',
    imagePath: 'https://image.path/locale.jpg'
  }, {
    answer: 'another_answer'
  }]
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answerOptions: makeFakeSurveyAnswerOptions(),
    date: new Date()
  }
})

const makeValidatorStub = (): Validator => {
  class ValidatorStub implements Validator {
    validate (input: any): Error | null {
      return null
    }
  }
  return new ValidatorStub()
}

const makeAddSurveyStub = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (data: AddSurveyModel): Promise<void> {}
  }
  return new AddSurveyStub()
}

type SutTypes = {
  sut: AddSurveyController
  validatorStub: Validator
  addSurveyStub: AddSurvey
}

const makeSut = (): SutTypes => {
  const validatorStub = makeValidatorStub()
  const addSurveyStub = makeAddSurveyStub()
  const sut = new AddSurveyController(validatorStub, addSurveyStub)
  return {
    sut,
    validatorStub,
    addSurveyStub
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
    jest.spyOn(addSurveyStub, 'add').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(noContent())
  })
})
