import { Validator } from '../../protocols/validator'

export class ValidatorComposite implements Validator {
  private readonly validators: Validator[]

  constructor (validators: Validator[]) {
    this.validators = validators
  }

  validate (input: any): Error {
    let thisResponse = null as Error
    for (const validator of this.validators) {
      const validatorErrorBag = validator.validate(input)
      if (validatorErrorBag) {
        thisResponse = validatorErrorBag
        break
      }
    }
    return thisResponse
  }
}
