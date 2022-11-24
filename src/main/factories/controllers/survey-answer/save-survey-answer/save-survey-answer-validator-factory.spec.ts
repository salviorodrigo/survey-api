import { makeSaveSurveyAnswerValidator } from './save-survey-answer-validator-factory'
import { Validator } from '@/presentation/protocols'
import { ValidatorComposite, RequiredFieldValidator } from '@/validation/validators'

jest.mock('@/validation/validators/validator-composite.ts')

describe('AddSurveyValidator Factory', () => {
  test('Should call ValidatorComposite with all validators', () => {
    makeSaveSurveyAnswerValidator()
    const validators: Validator[] = []

    for (const field of ['accountId', 'surveyId', 'answer']) {
      validators.push(new RequiredFieldValidator(field))
    }

    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})
