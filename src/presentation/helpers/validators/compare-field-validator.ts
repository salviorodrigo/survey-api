import { InvalidParamError } from '../../errors'
import { Validator } from './validator'

export class CompareFieldValidator implements Validator {
  private readonly fieldName: string
  private readonly confirmationFieldName: string

  constructor (fieldName: string, confirmationFieldName: string) {
    this.fieldName = fieldName
    this.confirmationFieldName = confirmationFieldName
  }

  validate (input: any): Error {
    let thisResponse = null as Error

    if (input[this.fieldName] !== input[this.confirmationFieldName]) {
      thisResponse = new InvalidParamError(this.confirmationFieldName)
    }

    return thisResponse
  }
}
