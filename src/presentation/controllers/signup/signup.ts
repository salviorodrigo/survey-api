import { badRequest, serverError, ok } from './../../helpers/http-helper'
import { HttpRequest, HttpResponse, Controller, EmailValidator, AddAccount, Validator } from './signup-protocols'
import { InvalidParamError } from '../../errors'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount
  private readonly validator: Validator

  constructor (emailValidator: EmailValidator, addAccount: AddAccount, validator: Validator) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
    this.validator = validator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const thisResponse = {
      filled: false,
      data: {
        statusCode: 200,
        body: {}
      }
    }

    try {
      if (!thisResponse.filled) {
        const validatorErrorBag = this.validator.validate(httpRequest.body)
        if (validatorErrorBag) {
          thisResponse.data = badRequest(validatorErrorBag)
          thisResponse.filled = true
        }
      }

      const { name, email, password } = httpRequest.body

      if (!thisResponse.filled) {
        const isAnValidEmail = this.emailValidator.isValid(email)
        if (!isAnValidEmail) {
          thisResponse.data = badRequest(new InvalidParamError('email'))
          thisResponse.filled = true
        }
      }

      if (!thisResponse.filled) {
        const account = await this.addAccount.add({
          name,
          email,
          password
        })

        thisResponse.data = ok(account)
        thisResponse.filled = true
      }
    } catch (error) {
      thisResponse.filled = true
      thisResponse.data = serverError(error)
    }

    return thisResponse.data
  }
}
