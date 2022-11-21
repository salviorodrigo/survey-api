import { makeAddSurveyValidator } from './add-survey-validator-factory'
import { Validator } from '@/presentation/protocols'
import { ValidatorComposite, RequiredFieldValidator } from '@/validation/validators'

jest.mock('@/validation/validators/validator-composite.ts')

describe('AddSurveyValidator Factory', () => {
  test('Should call ValidatorComposite with all validators', () => {
    makeAddSurveyValidator()
    const validators: Validator[] = []

    for (const field of ['question', 'answerOptions']) {
      validators.push(new RequiredFieldValidator(field))
    }

    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})
