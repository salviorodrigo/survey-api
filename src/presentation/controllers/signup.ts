import { badRequest, serverError } from './helpers/http-helper'
import { HttpRequest, HttpResponse } from '../protocols/http'
import { MissingParamError } from './../erros/missing-param-error'
import { Controller } from '../protocols/controllers'
import { EmailValidator } from '../protocols/email-validator'
import { InvalidParamError } from './../erros/invalid-param-error'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    const thisResponse = {
      filled: false,
      data: {
        statusCode: 200,
        body: {}
      }
    }

    try {
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

      if (!thisResponse.filled) {
        const isAnValidEmail = this.emailValidator.isValid(httpRequest.body.email)
        if (!isAnValidEmail) {
          thisResponse.data = badRequest(new InvalidParamError('email'))
          thisResponse.filled = true
        }
      }
    } catch (error) {
      thisResponse.filled = true
      thisResponse.data = serverError()
    }

    return thisResponse.data
  }
}
