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
  validatorStubs: Validator[]
}

const makeSut = (): SutTypes => {
  const validatorStubs = [
    makeValidatorStub(),
    makeValidatorStub()
  ]
  const sut = new ValidatorComposite(validatorStubs)

  return {
    sut,
    validatorStubs
  }
}

describe('Validator Composite', () => {
  test('Should return an error if any validator fails', () => {
    const { sut, validatorStubs } = makeSut()
    jest.spyOn(validatorStubs[0], 'validate').mockImplementationOnce(() => {
      return new MissingParamError('field')
    })

    const thisResponse = sut.validate({ field: 'any_value' })
    expect(thisResponse).toEqual(new MissingParamError('field'))
  })

  test('Should return the first error if more then one validation fails', () => {
    const { sut, validatorStubs } = makeSut()
    jest.spyOn(validatorStubs[0], 'validate').mockImplementationOnce(() => {
      return new Error()
    })

    jest.spyOn(validatorStubs[1], 'validate').mockImplementationOnce(() => {
      return new MissingParamError('field')
    })

    const thisResponse = sut.validate({ field: 'any_value' })
    expect(thisResponse).toEqual(new Error())
  })

  test('Should not return if validation succeeds', () => {
    const { sut } = makeSut()

    const thisResponse = sut.validate({ field: 'any_value' })
    expect(thisResponse).toBeFalsy()
  })
})
