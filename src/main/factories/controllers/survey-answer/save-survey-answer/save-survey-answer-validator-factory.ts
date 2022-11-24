import { Validator } from '@/presentation/protocols'
import { ValidatorComposite, RequiredFieldValidator } from '@/validation/validators'

export const makeSaveSurveyAnswerValidator = (): ValidatorComposite => {
  const validators: Validator[] = []
  for (const field of ['accountId', 'surveyId', 'answer']) {
    validators.push(new RequiredFieldValidator(field))
  }

  return new ValidatorComposite(validators)
}
