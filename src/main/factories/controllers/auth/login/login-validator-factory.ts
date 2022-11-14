import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter'
import { Validator } from '@/presentation/protocols'
import { ValidatorComposite, RequiredFieldValidator, EmailValidator } from '@/validation/validators'

export const makeLoginValidator = (): ValidatorComposite => {
  const validators: Validator[] = []
  for (const field of ['email', 'password']) {
    validators.push(new RequiredFieldValidator(field))
  }

  validators.push(new EmailValidator('email', new EmailValidatorAdapter()))

  return new ValidatorComposite(validators)
}
