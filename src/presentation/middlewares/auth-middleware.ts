import { AccessDeniedError } from './../errors/access-denied-error'
import { forbidden, ok, serverError } from './../helpers/http/http-helper'
import { Middleware, HttpRequest, HttpResponse } from '../protocols'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByTokenStub: LoadAccountByToken,
    private readonly role?: string
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const thisResponse = {
      filled: false,
      data: forbidden(new AccessDeniedError())
    }
    try {
      if (!thisResponse.filled) {
        if (!httpRequest.headers?.['x-access-token']) {
          thisResponse.filled = true
        }
      }

      if (!thisResponse.filled) {
        const accessToken = httpRequest.headers?.['x-access-token']
        const account = await this.loadAccountByTokenStub.load(accessToken, this.role)
        if (account) {
          thisResponse.data = ok({ accountId: account.id })
          thisResponse.filled = true
        }
      }
    } catch (error) {
      thisResponse.data = serverError(error)
      thisResponse.filled = true
    }
    return thisResponse.data
  }
}
