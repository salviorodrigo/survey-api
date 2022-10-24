import { ValidatorComposite, RequiredFieldValidator, CompareFieldValidator, EmailValidator } from '../../../presentation/helpers/validators'
import { makeSignUpValidator } from './signup-validator'
import { Validator } from '../../../presentation/protocols/validator'
import { EmailValidator as EmailValidatorInterface } from '../../../presentation/protocols/email-validator'

jest.mock('../../../presentation/helpers/validators/validator-composite')

const makeEmailValidator = (): EmailValidatorInterface => {
  class EmailValidatorAdapterStub implements EmailValidatorInterface {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorAdapterStub()
}

describe('SignUpValidator Factory', () => {
  test('Should call ValidatorComposite with all validators', () => {
    makeSignUpValidator()
    const validators: Validator[] = []

    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validators.push(new RequiredFieldValidator(field))
    }

    validators.push(new CompareFieldValidator('password', 'passwordConfirmation'))
    validators.push(new EmailValidator('email', makeEmailValidator()))

    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})
