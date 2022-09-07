import { badRequest, serverError } from './helpers/http-helper'
import { HttpRequest, HttpResponse, Controller, EmailValidator } from '../protocols'
import { MissingParamError, InvalidParamError } from '../errors'

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
      const { email, password, passwordConfirmation } = httpRequest.body
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
    } catch (error) {
      thisResponse.filled = true
      thisResponse.data = serverError()
    }

    return thisResponse.data
  }
}
