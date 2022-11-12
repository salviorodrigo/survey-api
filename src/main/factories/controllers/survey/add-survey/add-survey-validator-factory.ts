import { ValidatorComposite, RequiredFieldValidator } from '../../../../../validation/validators'
import { Validator } from '../../../../../presentation/protocols'

export const makeAddSurveyValidator = (): ValidatorComposite => {
  const validators: Validator[] = []
  for (const field of ['question', 'answers']) {
    validators.push(new RequiredFieldValidator(field))
  }

  return new ValidatorComposite(validators)
}
