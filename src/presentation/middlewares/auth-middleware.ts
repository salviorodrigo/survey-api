import { AccessDeniedError } from './../errors/access-denied-error'
import { forbidden } from './../helpers/http/http-helper'
import { Middleware, HttpRequest, HttpResponse } from '../protocols'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'

export class AuthMiddleware implements Middleware {
  constructor (private readonly loadAccountByTokenStub: LoadAccountByToken) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const thisResponse = {
      filled: false,
      data: forbidden(new AccessDeniedError())
    }
    if (!thisResponse.filled) {
      if (!httpRequest.headers?.['x-access-token']) {
        thisResponse.filled = true
      }
    }

    if (!thisResponse.filled) {
      const accessToken = httpRequest.headers?.['x-access-token']
      const account = await this.loadAccountByTokenStub.load(accessToken)
      if (account) {
        thisResponse.data = null
        thisResponse.filled = true
      }
    }

    return thisResponse.data
  }
}
