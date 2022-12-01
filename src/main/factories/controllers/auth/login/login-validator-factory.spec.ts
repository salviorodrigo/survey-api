import { makeLoginValidator } from './login-validator-factory'
import { Validator } from '@/presentation/protocols'
import { ValidatorComposite, RequiredFieldValidator, EmailValidator } from '@/validation/validators'
import { mockEmailValidator } from '@/validation/protocols/mocks'

jest.mock('@/validation/validators/validator-composite.ts')

describe('LoginValidator Factory', () => {
  test('Should call ValidatorComposite with all validators', () => {
    makeLoginValidator()
    const validators: Validator[] = []

    for (const field of ['email', 'password']) {
      validators.push(new RequiredFieldValidator(field))
    }

    validators.push(new EmailValidator('email', mockEmailValidator()))

    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})
