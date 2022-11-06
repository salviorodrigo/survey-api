import { AccessDeniedError } from './../errors/access-denied-error'
import { forbidden } from './../helpers/http/http-helper'
import { Middleware, HttpRequest, HttpResponse } from '../protocols'

export class AuthMiddleware implements Middleware {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return await Promise.resolve(forbidden(new AccessDeniedError()))
  }
}
