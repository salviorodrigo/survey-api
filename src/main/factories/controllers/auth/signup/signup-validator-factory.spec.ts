import { makeSignUpValidator } from './signup-validator-factory'
import { Validator } from '@/presentation/protocols'
import { ValidatorComposite, RequiredFieldValidator, CompareFieldsValidator, EmailValidator } from '@/validation/validators'
import { mockEmailValidator } from '@/validation/protocols/mocks'

jest.mock('@/validation/validators/validator-composite')

describe('SignUpValidator Factory', () => {
  test('Should call ValidatorComposite with all validators', () => {
    makeSignUpValidator()
    const validators: Validator[] = []

    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validators.push(new RequiredFieldValidator(field))
    }

    validators.push(new CompareFieldsValidator('password', 'passwordConfirmation'))
    validators.push(new EmailValidator('email', mockEmailValidator()))

    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})
