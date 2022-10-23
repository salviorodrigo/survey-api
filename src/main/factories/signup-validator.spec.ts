import { ValidatorComposite } from './../../presentation/helpers/validators/validator-composite'
import { makeSignUpValidator } from './signup-validator'
import { RequiredFieldValidator } from '../../presentation/helpers/validators/required-field-validator'
import { Validator } from '../../presentation/helpers/validators/validator'
import { CompareFieldValidator } from '../../presentation/helpers/validators/compare-field-validator copy'

jest.mock('./../../presentation/helpers/validators/validator-composite')

describe('SignUpValidator Factory', () => {
  test('Should call ValidatorComposite with all validators', () => {
    makeSignUpValidator()
    const validators: Validator[] = []

    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validators.push(new RequiredFieldValidator(field))
    }

    validators.push(new CompareFieldValidator('password', 'passwordConfirmation'))

    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})
