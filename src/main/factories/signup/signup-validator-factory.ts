import { ValidatorComposite, RequiredFieldValidator, CompareFieldValidator, EmailValidator } from '../../../presentation/helpers/validators'
import { Validator } from '../../../presentation/protocols/validator'
import { EmailValidatorAdapter } from '../../adapters/validators/email-validator-adapter'

export const makeSignUpValidator = (): ValidatorComposite => {
  const validators: Validator[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validators.push(new RequiredFieldValidator(field))
  }

  validators.push(new CompareFieldValidator('password', 'passwordConfirmation'))
  validators.push(new EmailValidator('email', new EmailValidatorAdapter()))

  return new ValidatorComposite(validators)
}
