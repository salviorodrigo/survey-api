import { makeSignUpValidator } from './signup-validator-factory'
import { Validator } from '@/presentation/protocols'
import { ValidatorComposite, RequiredFieldValidator, CompareFieldsValidator, EmailValidator } from '@/validation/validators'
import { EmailValidator as EmailValidatorInterface } from '@/validation/protocols/email-validator'

jest.mock('@/validation/validators/validator-composite')

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

    validators.push(new CompareFieldsValidator('password', 'passwordConfirmation'))
    validators.push(new EmailValidator('email', makeEmailValidator()))

    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})
