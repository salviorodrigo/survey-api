import { MissingParamError } from '../../errors'
import { RequiredFieldValidator } from './required-field-validator'

describe('RequiredField Validator', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const sut = new RequiredFieldValidator('field')
    const thisResponse = sut.validate({
      name: 'any_name'
    })
    expect(thisResponse).toEqual(new MissingParamError('field'))
  })
})
