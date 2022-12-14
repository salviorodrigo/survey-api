import {
  HttpRequest,
  HttpResponse,
  Controller,
  AddAccount,
  Validator,
  Authenticator
} from './signup-controller-protocols'
import { EmailTakenError } from '@/presentation/errors/email-taken-error'
import { badRequest, serverError, ok, forbidden } from '@/presentation/helpers/http/http-helper'

export class SignUpController implements Controller {
  constructor (
    private readonly accountAdder: AddAccount,
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
      const { name, email, password } = httpRequest.body

      if (!thisResponse.filled) {
        const validatorErrorBag = this.validator.validate(httpRequest.body)
        if (validatorErrorBag) {
          thisResponse.data = badRequest(validatorErrorBag)
          thisResponse.filled = true
        }
      }

      if (!thisResponse.filled) {
        const account = await this.accountAdder.add({
          name,
          email,
          password
        })

        if (account) {
          const accessToken = await this.authenticator.auth({
            email,
            password
          })

          thisResponse.data = ok({ accessToken })
        } else {
          thisResponse.data = forbidden(new EmailTakenError())
        }
        thisResponse.filled = true
      }
    } catch (error) {
      thisResponse.filled = true
      thisResponse.data = serverError(error)
    }

    return thisResponse.data
  }
}
