import { MissingParamError } from './../../errors/missing-param-error'
import { Validator } from './validator'
import { ValidatorComposite } from './validator-composite'

const makeValidatorStub = (): Validator => {
  class ValidatorStub implements Validator {
    validate (input: any): Error {
      return null
    }
  }

  return new ValidatorStub()
}

interface SutTypes {
  sut: ValidatorComposite
  validatorStub: Validator
}

const makeSut = (): SutTypes => {
  const validatorStub = makeValidatorStub()
  const sut = new ValidatorComposite([
    validatorStub
  ])

  return {
    sut,
    validatorStub
  }
}

describe('Validator Composite', () => {
  test('Should return an error if any validator fails', () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validate').mockImplementationOnce(() => {
      return new MissingParamError('field')
    })

    const thisResponse = sut.validate({ field: 'any_value' })
    expect(thisResponse).toEqual(new MissingParamError('field'))
  })

  test('Should not return if validation succeeds', () => {
    const { sut } = makeSut()

    const thisResponse = sut.validate({ field: 'any_value' })
    expect(thisResponse).toBeFalsy()
  })
})
