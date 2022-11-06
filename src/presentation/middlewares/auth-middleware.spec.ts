import { AccessDeniedError } from './../errors'
import { forbidden } from './../helpers/http/http-helper'
import { HttpRequest } from './../protocols/http'
import { AuthMiddleware } from './auth-middleware'

interface SutTypes {
  sut: AuthMiddleware
}

const makeSut = (): SutTypes => {
  const sut = new AuthMiddleware()

  return {
    sut
  }
}

describe('Auth Middleware', () => {
  test('Should return 403 if x-access-token no existis in headers', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      headers: {}
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
})
