import { Controller, EmailValidator, HttpRequest, HttpResponse, Authenticator } from './login-protocols'
import { badRequest, serverError, unauthorized, ok } from './../../helpers/http-helper'
import { InvalidParamError, MissingParamError } from '../../errors'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly authenticator: Authenticator

  constructor (emailValidator: EmailValidator, authenticator: Authenticator) {
    this.emailValidator = emailValidator
    this.authenticator = authenticator
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

      const { email, password } = httpRequest.body

      if (!thisResponse.filled) {
        const isValidEmail = this.emailValidator.isValid(email)
        if (!isValidEmail) {
          thisResponse.filled = true
          thisResponse.data = badRequest(new InvalidParamError('email'))
        }
      }

      if (!thisResponse.filled) {
        const accessToken = await this.authenticator.auth(email, password)
        thisResponse.filled = true

        if (!accessToken) {
          thisResponse.data = unauthorized()
        } else {
          thisResponse.data = ok({
            accessToken
          })
        }
      }
    } catch (error) {
      thisResponse.filled = true
      thisResponse.data = serverError(error)
    }

    return thisResponse.data
  }
}
