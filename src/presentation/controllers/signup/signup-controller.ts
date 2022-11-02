import { badRequest, serverError, ok } from '../../helpers/http/http-helper'
import { HttpRequest, HttpResponse, Controller, AddAccount, Validator, Authenticator } from './signup-controller-protocols'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validator: Validator,
    private readonly authenticator: Authenticator
  ) {}

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
        const account = await this.addAccount.add({
          name,
          email,
          password
        })
        const accessToken = await this.authenticator.auth({
          email: account.email,
          password: account.password
        })
        thisResponse.data = ok({
          accessToken
        })
        thisResponse.filled = true
      }
    } catch (error) {
      thisResponse.filled = true
      thisResponse.data = serverError(error)
    }

    return thisResponse.data
  }
}
