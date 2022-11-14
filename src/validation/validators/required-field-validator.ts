import { MissingParamError } from '@/presentation/errors'
import { Validator } from '@/presentation/protocols'

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
