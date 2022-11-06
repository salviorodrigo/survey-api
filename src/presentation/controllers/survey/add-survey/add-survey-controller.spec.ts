import { Validator } from './../../../protocols/validator'
import { HttpRequest } from '../../../protocols/http'
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
})
