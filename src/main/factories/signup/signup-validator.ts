import { ValidatorComposite } from '../../../presentation/helpers/validators/validator-composite'
import { RequiredFieldValidator } from '../../../presentation/helpers/validators/required-field-validator'
import { Validator } from '../../../presentation/protocols/validator'
import { CompareFieldValidator } from '../../../presentation/helpers/validators/compare-field-validator'
import { EmailValidator } from '../../../presentation/helpers/validators/email-validator'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

export const makeSignUpValidator = (): ValidatorComposite => {
  const validators: Validator[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validators.push(new RequiredFieldValidator(field))
  }

  validators.push(new CompareFieldValidator('password', 'passwordConfirmation'))
  validators.push(new EmailValidator('email', new EmailValidatorAdapter()))

  return new ValidatorComposite(validators)
}
