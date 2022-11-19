import { CompareFieldsValidator } from './compare-fields-validator'
import { InvalidParamError } from '@/presentation/errors'

const makeSut = (): CompareFieldsValidator => {
  return new CompareFieldsValidator('field', 'fieldConfirmation')
}

describe('CompareFields Validator', () => {
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
