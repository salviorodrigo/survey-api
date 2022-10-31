import { MissingParamError } from '../../errors'
import { Validator } from '../../protocols/validator'

export class RequiredFieldValidator implements Validator {
  constructor (private readonly requiredFieldName: string) {}

  validate (input: any): Error {
    let thisResponse = null as Error

    if (!input[this.requiredFieldName]) {
      thisResponse = new MissingParamError(this.requiredFieldName)
    }

    return thisResponse
  }
}
