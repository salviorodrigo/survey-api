import { Controller, HttpRequest, HttpResponse, Authenticator, Validator } from './login-protocols'
import { badRequest, serverError, unauthorized, ok } from '../../helpers/http/http-helper'

export class LoginController implements Controller {
  private readonly authenticator: Authenticator
  private readonly validator: Validator

  constructor (authenticator: Authenticator, validator: Validator) {
    this.authenticator = authenticator
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

      const { email, password } = httpRequest.body

      if (!thisResponse.filled) {
        const accessToken = await this.authenticator.auth({
          email,
          password
        })
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
