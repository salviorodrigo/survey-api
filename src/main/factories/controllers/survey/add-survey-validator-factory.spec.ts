import { ValidatorComposite, RequiredFieldValidator } from '../../../../validation/validators'
import { makeAddSurveyValidator } from './add-survey-validator-factory'
import { Validator } from '../../../../presentation/protocols'

jest.mock('../../../../validation/validators/validator-composite.ts')

describe('AddSurveyValidator Factory', () => {
  test('Should call ValidatorComposite with all validators', () => {
    makeAddSurveyValidator()
    const validators: Validator[] = []

    for (const field of ['question', 'answers']) {
      validators.push(new RequiredFieldValidator(field))
    }

    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})
