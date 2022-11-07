import { AccessDeniedError } from './../errors/access-denied-error'
import { forbidden } from './../helpers/http/http-helper'
import { Middleware, HttpRequest, HttpResponse } from '../protocols'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'

export class AuthMiddleware implements Middleware {
  constructor (private readonly loadAccountByTokenStub: LoadAccountByToken) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const thisResponse = {
      filled: false,
      data: null
    }
    if (!thisResponse.filled) {
      if (!httpRequest.headers?.['x-access-token']) {
        thisResponse.data = forbidden(new AccessDeniedError())
      }
    }

    if (!thisResponse.filled) {
      const accessToken = httpRequest.headers?.['x-access-token']
      if (accessToken) {
        await this.loadAccountByTokenStub.load(accessToken)
        thisResponse.data = null
      }
    }

    return thisResponse.data
  }
}
