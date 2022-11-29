import { mockEncrypter, mockHashComparer } from '@/data/protocols/cryptography'
import { mockLoadAccountByEmailRepository, mockUpdateAccessTokenRepository } from '@/data/protocols/db/account'
import { mockAccountModel } from '@/domain/models'
import { mockAuthenticatorParams } from '@/domain/usecases/account'
import { DbAuthenticator } from './db-authenticator'
import {
  HashComparer,
  Encrypter,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository
} from './db-authenticator-protocols'

type SutTypes = {
  sut: DbAuthenticator
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  encrypterStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
  const hashComparerStub = mockHashComparer()
  const encrypterStub = mockEncrypter()
  const updateAccessTokenRepositoryStub = mockUpdateAccessTokenRepository()
  const sut = new DbAuthenticator(loadAccountByEmailRepositoryStub, hashComparerStub, encrypterStub, updateAccessTokenRepositoryStub)
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  }
}

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    const credentials = mockAuthenticatorParams()
    await sut.auth(credentials)
    expect(loadSpy).toHaveBeenCalledWith(credentials.email)
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockRejectedValueOnce(new Error())
    const credentials = mockAuthenticatorParams()
    const httpResponse = sut.auth(credentials)
    await expect(httpResponse).rejects.toThrow()
  })

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(null)
    const credentials = mockAuthenticatorParams()
    const accessToken = await sut.auth(credentials)
    expect(accessToken).toBeNull()
  })

  test('Should call HashCompare with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    const credentials = mockAuthenticatorParams()
    await sut.auth(credentials)

    const fakeAccount = mockAccountModel()
    expect(compareSpy).toHaveBeenCalledWith(credentials.password, fakeAccount.password)
  })

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockRejectedValueOnce(new Error())
    const credentials = mockAuthenticatorParams()
    const httpResponse = sut.auth(credentials)
    await expect(httpResponse).rejects.toThrow()
  })

  test('Should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockResolvedValueOnce(false)
    const credentials = mockAuthenticatorParams()
    const accessToken = await sut.auth(credentials)
    expect(accessToken).toBeNull()
  })

  test('Should call Encrypter with correct id', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const credentials = mockAuthenticatorParams()
    await sut.auth(credentials)

    const fakeAccount = mockAccountModel()
    expect(encryptSpy).toHaveBeenCalledWith(fakeAccount.id)
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockRejectedValueOnce(new Error())
    const credentials = mockAuthenticatorParams()
    const httpResponse = sut.auth(credentials)
    await expect(httpResponse).rejects.toThrow()
  })

  test('Should DbAuthenticator return access token on success', async () => {
    const { sut } = makeSut()
    const credentials = mockAuthenticatorParams()
    const fakeAccessToken = mockAccountModel().accessToken
    const httpResponse = await sut.auth(credentials)
    expect(httpResponse).toBe(fakeAccessToken)
  })

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
    const credentials = mockAuthenticatorParams()
    const accessToken = await sut.auth(credentials)
    const fakeAccount = mockAccountModel()
    expect(updateSpy).toHaveBeenCalledWith(fakeAccount.id, accessToken)
  })

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockRejectedValueOnce(new Error())
    const credentials = mockAuthenticatorParams()
    const httpResponse = sut.auth(credentials)
    await expect(httpResponse).rejects.toThrow()
  })
})
