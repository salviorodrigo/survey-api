import { InvalidParamError } from '@/presentation/errors'
import { EmailValidator as EmailValidatorInterface } from '@/validation/protocols/email-validator'
import { Validator } from '@/presentation/protocols'

export class EmailValidator implements Validator {
  constructor (
    private readonly emailFieldName: string,
    private readonly emailValidatorAdapter: EmailValidatorInterface
  ) {}

  validate (input: any): Error {
    let thisResponse = null as Error

    if (!this.emailValidatorAdapter.isValid(input[this.emailFieldName])) {
      thisResponse = new InvalidParamError(this.emailFieldName)
    }

    return thisResponse
  }
}
