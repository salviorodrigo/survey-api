import { ValidatorComposite, RequiredFieldValidator, EmailValidator } from '../../../presentation/helpers/validators'
import { makeLoginValidator } from './login-validator-factory'
import { Validator } from '../../../presentation/protocols/validator'
import { EmailValidator as EmailValidatorInterface } from '../../../presentation/protocols/email-validator'

jest.mock('../../../presentation/helpers/validators/validator-composite.ts')

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
