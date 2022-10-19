import { badRequest, serverError, ok } from './../../helpers/http-helper'
import { HttpRequest, HttpResponse, Controller, EmailValidator, AddAccount, Validator } from './signup-protocols'
import { MissingParamError, InvalidParamError } from '../../errors'

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

      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      if (!thisResponse.filled) {
        for (const field of requiredFields) {
          if (!httpRequest.body[field]) {
            thisResponse.data = badRequest(new MissingParamError(field))
            thisResponse.filled = true
            break
          }
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body

      if (!thisResponse.filled) {
        const passwordConfirmationMatch = (password === passwordConfirmation)
        if (!passwordConfirmationMatch) {
          thisResponse.data = badRequest(new InvalidParamError('passwordConfirmation'))
          thisResponse.filled = true
        }
      }

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
