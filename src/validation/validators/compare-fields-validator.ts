import { InvalidParamError } from '@/presentation/errors'
import { Validator } from '@/presentation/protocols'

export class CompareFieldsValidator implements Validator {
  constructor (
    private readonly fieldName: string,
    private readonly confirmationFieldName: string
  ) {}

  validate (input: any): Error {
    let thisResponse = null as Error

    if (input[this.fieldName] !== input[this.confirmationFieldName]) {
      thisResponse = new InvalidParamError(this.confirmationFieldName)
    }

    return thisResponse
  }
}
