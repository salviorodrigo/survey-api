import { ValidatorComposite } from './../../presentation/helpers/validators/validator-composite'
import { RequiredFieldValidator } from '../../presentation/helpers/validators/required-field-validator'
import { Validator } from '../../presentation/helpers/validators/validator'

export const makeSignUpValidator = (): ValidatorComposite => {
  const validators: Validator[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validators.push(new RequiredFieldValidator(field))
  }

  return new ValidatorComposite(validators)
}
