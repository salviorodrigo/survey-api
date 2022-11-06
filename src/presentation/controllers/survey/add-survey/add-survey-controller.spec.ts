import { badRequest } from './../../../helpers/http/http-helper'
import { Validator, HttpRequest, AddSurvey, AddSurveyModel } from './add-survey-protocols'
import { AddSurveyController } from './add-survey-controller'

describe('AddSurvey Controller', () => {
  const makeFakeRequest = (): HttpRequest => ({
    body: {
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }]
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

  interface SutTypes {
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
})
