import { MissingParamError } from '../../errors'
import { RequiredFieldValidator } from './required-field-validator'

const makeSut = (): RequiredFieldValidator => {
  return new RequiredFieldValidator('field')
}

describe('RequiredField Validator', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const sut = makeSut()
    const thisResponse = sut.validate({
      name: 'any_name'
    })
    expect(thisResponse).toEqual(new MissingParamError('field'))
  })

  test('Should not returns if validation succeeds', () => {
    const sut = makeSut()
    const thisResponse = sut.validate({
      field: 'any_value'
    })
    expect(thisResponse).toBeFalsy()
  })
})
