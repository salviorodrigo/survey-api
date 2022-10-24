import { MissingParamError } from './../../errors/missing-param-error'
import { Validator } from './validator'
import { ValidatorComposite } from './validator-composite'

makeSut

describe('Validator Composite', () => {
  test('Should return an error if any validator fails', () => {
    class ValidatorStub implements Validator {
      validate (input: any): Error {
        return null
      }
    }

    const validatorStub = new ValidatorStub()
    jest.spyOn(validatorStub, 'validate').mockImplementationOnce(() => {
      return new MissingParamError('field')
    })
    const sut = new ValidatorComposite([
      validatorStub
    ])

    const thisResponse = sut.validate({ field: 'any_value' })
    expect(thisResponse).toEqual(new MissingParamError('field'))
  })
})
