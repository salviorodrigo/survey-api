import { AuthMiddleware } from './auth-middleware'
import { LoadAccountByToken, HttpRequest } from './auth-middleware-protocols'
import { AccessDeniedError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { mockLoadAccountByToken } from '@/domain/usecases/account'
import { mockAccountModel } from '@/domain/models'

const makeFakeRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'valid_token'
  }
})

type SutTypes = {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = mockLoadAccountByToken()
  const sut = new AuthMiddleware(loadAccountByTokenStub, role)
  return {
    sut,
    loadAccountByTokenStub
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

  test('Should call LoadAccountByToken with correct accessToken', async () => {
    const fakeRole = 'any_role'
    const { sut, loadAccountByTokenStub } = makeSut(fakeRole)
    const loadAccountSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(loadAccountSpy).toHaveBeenCalledWith(httpRequest.headers['x-access-token'], fakeRole)
  })

  test('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockResolvedValueOnce(null)
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok({ accountId: mockAccountModel().id }))
  })

  test('Should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
