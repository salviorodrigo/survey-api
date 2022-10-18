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

    if (!thisResponse.filled) {
      if (!httpRequest.body.email) {
        thisResponse.filled = true
        thisResponse.data = badRequest(new MissingParamError('email'))
      }
    }

    if (!thisResponse.filled) {
      if (!httpRequest.body.password) {
        thisResponse.filled = true
        thisResponse.data = badRequest(new MissingParamError('password'))
      }
    }

    if (!thisResponse.filled) {
      if (!this.emailValidator.isValid(httpRequest.body.email)) {
        thisResponse.filled = true
        thisResponse.data = badRequest(new InvalidParamError('email'))
      }
    }

    return thisResponse.data
  }
}
