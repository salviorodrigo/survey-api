import { Validator } from '../../presentation/protocols'

export class ValidatorComposite implements Validator {
  constructor (private readonly validators: Validator[]) {}

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
