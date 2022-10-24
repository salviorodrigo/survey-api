import { ValidatorComposite } from './../../../presentation/helpers/validators/validator-composite'
import { RequiredFieldValidator } from './../../../presentation/helpers/validators/required-field-validator'
import { Validator } from './../../../presentation/helpers/validators/validator'
import { EmailValidator } from './../../../presentation/helpers/validators/email-validator'
import { EmailValidatorAdapter } from './../../../utils/email-validator-adapter'

export const makeLoginValidator = (): ValidatorComposite => {
  const validators: Validator[] = []
  for (const field of ['email', 'password']) {
    validators.push(new RequiredFieldValidator(field))
  }

  validators.push(new EmailValidator('email', new EmailValidatorAdapter()))

  return new ValidatorComposite(validators)
}
