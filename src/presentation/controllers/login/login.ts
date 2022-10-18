import { badRequest } from './../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { MissingParamError } from '../../errors'

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const thisResponse = {
      filled: false,
      data: {
        statusCode: 200,
        body: {}
      }
    }

    if (!httpRequest.body.email) {
      thisResponse.filled = true
      thisResponse.data = badRequest(new MissingParamError('email'))
    }

    if (!httpRequest.body.password) {
      thisResponse.filled = true
      thisResponse.data = badRequest(new MissingParamError('password'))
    }

    return thisResponse.data
  }
}
