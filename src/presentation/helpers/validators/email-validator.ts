import { InvalidParamError } from './../../errors'
import { EmailValidator as EmailValidatorInterface } from '../../protocols/email-validator'
import { Validator } from './validator'

export class EmailValidator implements Validator {
  private readonly emailFieldName: string
  private readonly emailValidatorAdapter: EmailValidatorInterface

  constructor (emailFieldName: string, emailValidatorAdapter: EmailValidatorInterface) {
    this.emailFieldName = emailFieldName
    this.emailValidatorAdapter = emailValidatorAdapter
  }

  validate (input: any): Error {
    let thisResponse = null as Error

    if (!this.emailValidatorAdapter.isValid(input[this.emailFieldName])) {
      thisResponse = new InvalidParamError(this.emailFieldName)
    }

    return thisResponse
  }
}
