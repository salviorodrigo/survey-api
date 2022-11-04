import { SignUpController } from './signup-controller'
import { MissingParamError, EmailTakenError } from '../../errors'
import { AddAccount, AddAccountModel, AccountModel, Validator, HttpRequest, Authenticator, AuthenticatorModel } from './signup-controller-protocols'
import { ok, badRequest, serverError, forbidden } from '../../helpers/http/http-helper'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

const makeFakeAccessToken = async (): Promise<string> => {
  const fakeAccount = makeFakeAccount()
  return await makeAuthenticatorStub().auth({
    email: fakeAccount.email,
    password: fakeAccount.password
  })
}

const makeValidatorStub = (): Validator => {
  class ValidatorStub implements Validator {
    validate (input: any): Error | null {
      return null
    }
  }
  return new ValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = makeFakeAccount()
      return await new Promise(resolve => resolve(fakeAccount))
    }
  }
  return new AddAccountStub()
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
  sut: SignUpController
  addAccountStub: AddAccount
  validatorStub: Validator
  authenticatorStub: Authenticator
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const validatorStub = makeValidatorStub()
  const authenticatorStub = makeAuthenticatorStub()
  const sut = new SignUpController(addAccountStub, validatorStub, authenticatorStub)
  return {
    sut,
    addAccountStub,
    validatorStub,
    authenticatorStub
  }
}

describe('Signup Controller', () => {
  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(new Error()))
    })
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: httpRequest.body.name,
      email: httpRequest.body.email,
      password: httpRequest.body.password
    })
  })

  test('Should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden(new EmailTakenError()))
  })

  test('Should return 200 if an valid data is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok({
      accessToken: await makeFakeAccessToken()
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

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticatorStub } = makeSut()

    const authSpy = jest.spyOn(authenticatorStub, 'auth')
    const httpRequest: HttpRequest = makeFakeRequest()
    const fakeAccount = makeFakeAccount()
    await sut.handle(httpRequest)
    expect(authSpy).toHaveBeenCalledWith({
      email: fakeAccount.email,
      password: fakeAccount.password
    })
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
})
