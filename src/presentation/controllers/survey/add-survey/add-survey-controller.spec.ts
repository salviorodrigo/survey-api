import { badRequest } from './../../../helpers/http/http-helper'
import { Validator, HttpRequest } from './../../../protocols'
import { AddSurveyController } from './add-survey-controller'

describe('AddSurvey Controller', () => {
  const makeFakeRequest = (): HttpRequest => ({
    body: {
      questions: 'any_question',
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

  interface SutTypes {
    sut: AddSurveyController
    validatorStub: Validator
  }

  const makeSut = (): SutTypes => {
    const validatorStub = makeValidatorStub()
    const sut = new AddSurveyController(validatorStub)
    return {
      sut,
      validatorStub
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
})
