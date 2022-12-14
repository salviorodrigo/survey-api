import {
  LoadAccountByToken,
  HttpRequest,
  HttpResponse,
  Middleware
} from './auth-middleware-protocols'
import { AccessDeniedError } from '@/presentation/errors/access-denied-error'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly accountLoaderByToken: LoadAccountByToken,
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
        const account = await this.accountLoaderByToken.load(accessToken, this.role)
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
