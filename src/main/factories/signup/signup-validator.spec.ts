import { ValidatorComposite } from '../../../presentation/helpers/validators/validator-composite'
import { makeSignUpValidator } from './signup-validator'
import { RequiredFieldValidator } from '../../../presentation/helpers/validators/required-field-validator'
import { Validator } from '../../../presentation/protocols/validator'
import { CompareFieldValidator } from '../../../presentation/helpers/validators/compare-field-validator'
import { EmailValidator } from '../../../presentation/helpers/validators/email-validator'
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
