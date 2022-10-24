import { CompareFieldValidator } from './compare-field-validator'
import { InvalidParamError } from '../../errors'

const makeSut = (): CompareFieldValidator => {
  return new CompareFieldValidator('field', 'fieldConfirmation')
}

describe('RequiredField Validator', () => {
  test('Should return a InvalidParamError if validation fails', () => {
    const sut = makeSut()
    const thisResponse = sut.validate({
      field: 'any_value',
      fieldConfirmation: 'other_value'
    })
    expect(thisResponse).toEqual(new InvalidParamError('fieldConfirmation'))
  })

  test('Should not returns if validation succeeds', () => {
    const sut = makeSut()
    const thisResponse = sut.validate({
      field: 'any_value',
      fieldConfirmation: 'any_value'
    })
    expect(thisResponse).toBeFalsy()
  })
})
