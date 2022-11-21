import { Validator } from '@/presentation/protocols'
import { ValidatorComposite, RequiredFieldValidator } from '@/validation/validators'

export const makeAddSurveyValidator = (): ValidatorComposite => {
  const validators: Validator[] = []
  for (const field of ['question', 'answerOptions']) {
    validators.push(new RequiredFieldValidator(field))
  }

  return new ValidatorComposite(validators)
}
