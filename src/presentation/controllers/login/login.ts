import { badRequest } from './../../helpers/http-helper'
import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../../protocols'
import { InvalidParamError, MissingParamError } from '../../errors'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const thisResponse = {
      filled: false,
      data: {
        statusCode: 200,
        body: {}
      }
    }

    const requiredFields = ['email', 'password']
    if (!thisResponse.filled) {
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          thisResponse.data = badRequest(new MissingParamError(field))
          thisResponse.filled = true
          break
        }
      }
    }

    const { email } = httpRequest.body

    if (!thisResponse.filled) {
      const isValidEmail = this.emailValidator.isValid(email)
      if (!isValidEmail) {
        thisResponse.filled = true
        thisResponse.data = badRequest(new InvalidParamError('email'))
      }
    }

    return thisResponse.data
  }
}
