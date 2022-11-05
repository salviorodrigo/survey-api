import { badRequest, serverError, unauthorized, ok } from '../../../helpers/http/http-helper'
import { HttpRequest, Authenticator, Validator, AuthenticatorModel } from './login-controller-protocols'
import { LoginController } from './login-controller'
import { MissingParamError } from '../../../errors'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

const makeValidatorStub = (): Validator => {
  class ValidatorStub implements Validator {
    validate (input: any): Error | null {
      return null
    }
  }
  return new ValidatorStub()
}

const makeAuthenticatorStub = (): Authenticator => {
  class AuthenticatorStub implements Authenticator {
    async auth (credentials: AuthenticatorModel): Promise<string> {
      return 'any_token'
    }
  }
  return new AuthenticatorStub()
}

interface SutTypes {
  sut: LoginController
  authenticatorStub: Authenticator
  validatorStub: Validator
}

const makeSut = (): SutTypes => {
  const validatorStub = makeValidatorStub()
  const authenticatorStub = makeAuthenticatorStub()
  const sut = new LoginController(authenticatorStub, validatorStub)

  return {
    sut,
    authenticatorStub,
    validatorStub
  }
}

describe('Login Controller', () => {
  test('Should call Authentication with correct values', async () => {
    const { sut, authenticatorStub } = makeSut()

    const authSpy = jest.spyOn(authenticatorStub, 'auth')
    const httpRequest: HttpRequest = makeFakeRequest()

    await sut.handle(httpRequest)
    expect(authSpy).toHaveBeenCalledWith({
      email: httpRequest.body.email,
      password: httpRequest.body.password
    })
  })

  test('Should return 401 if invalid credentials provided', async () => {
    const { sut, authenticatorStub } = makeSut()

    jest.spyOn(authenticatorStub, 'auth').mockReturnValueOnce(new Promise(resolve => resolve('')))
    const httpRequest: HttpRequest = makeFakeRequest()

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 500 if authenticator throws', async () => {
    const { sut, authenticatorStub } = makeSut()

    jest.spyOn(authenticatorStub, 'auth').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest: HttpRequest = makeFakeRequest()

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 if valid credentials provided', async () => {
    const { sut } = makeSut()

    const httpRequest: HttpRequest = makeFakeRequest()

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok({
      accessToken: 'any_token'
    }))
  })

  test('Should call Validator with correct values', async () => {
    const { sut, validatorStub } = makeSut()
    const validatorSpy = jest.spyOn(validatorStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validatorSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if validator returns an error', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
