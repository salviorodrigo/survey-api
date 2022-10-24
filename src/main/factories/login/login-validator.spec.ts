import { ValidatorComposite } from './../../../presentation/helpers/validators/validator-composite'
import { makeLoginValidator } from './login-validator'
import { RequiredFieldValidator } from './../../../presentation/helpers/validators/required-field-validator'
import { Validator } from './../../../presentation/helpers/validators/validator'
import { EmailValidator } from './../../../presentation/helpers/validators/email-validator'
import { EmailValidator as EmailValidatorInterface } from './../../../presentation/protocols/email-validator'

jest.mock('./../../../presentation/helpers/validators/validator-composite')

const makeEmailValidator = (): EmailValidatorInterface => {
  class EmailValidatorAdapterStub implements EmailValidatorInterface {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorAdapterStub()
}

describe('LoginValidator Factory', () => {
  test('Should call ValidatorComposite with all validators', () => {
    makeLoginValidator()
    const validators: Validator[] = []

    for (const field of ['email', 'password']) {
      validators.push(new RequiredFieldValidator(field))
    }

    validators.push(new EmailValidator('email', makeEmailValidator()))

    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})
