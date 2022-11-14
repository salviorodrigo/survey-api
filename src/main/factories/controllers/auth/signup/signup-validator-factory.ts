import { Validator } from '@/presentation/protocols'
import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter'
import { ValidatorComposite, RequiredFieldValidator, CompareFieldValidator, EmailValidator } from '@/validation/validators'

export const makeSignUpValidator = (): ValidatorComposite => {
  const validators: Validator[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validators.push(new RequiredFieldValidator(field))
  }

  validators.push(new CompareFieldValidator('password', 'passwordConfirmation'))
  validators.push(new EmailValidator('email', new EmailValidatorAdapter()))

  return new ValidatorComposite(validators)
}
