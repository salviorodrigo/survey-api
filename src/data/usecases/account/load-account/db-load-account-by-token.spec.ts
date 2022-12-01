import { DbLoadAccountByToken } from './db-load-account-by-token'
import { Decrypter, LoadAccountByTokenRepository } from './db-load-account-by-token-protocols'
import { mockAccountModel } from '@/domain/models/mocks'
import { mockDecrypter } from '@/data/protocols/cryptography/mocks'
import { mockLoadAccountByTokenRepository } from '@/data/protocols/db/account/mocks'

type SutTypes = {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}

const makeSut = (): SutTypes => {
  const decrypterStub = mockDecrypter()
  const loadAccountByTokenRepositoryStub = mockLoadAccountByTokenRepository()
  const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenRepositoryStub)
  return {
    sut,
    decrypterStub,
    loadAccountByTokenRepositoryStub
  }
}

describe('DbLoadAccountByToken Usecase', () => {
  test('Should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    const { accessToken, role } = mockAccountModel()
    await sut.load(accessToken, role)
    expect(decryptSpy).toHaveBeenCalledWith(accessToken)
  })

  test('Should returns null if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockResolvedValueOnce(null)
    const { accessToken, role } = mockAccountModel()
    const thisResponse = await sut.load(accessToken, role)
    expect(thisResponse).toBeNull()
  })

  test('Should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
    const { accessToken, role } = mockAccountModel()
    await sut.load(accessToken, role)
    expect(loadByTokenSpy).toHaveBeenCalledWith(accessToken, role)
  })

  test('Should returns null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockResolvedValueOnce(null)
    const { accessToken, role } = mockAccountModel()
    const thisResponse = await sut.load(accessToken, role)
    expect(thisResponse).toBeNull()
  })

  test('Should returns an account on success', async () => {
    const { sut } = makeSut()
    const { accessToken, role } = mockAccountModel()
    const thisResponse = await sut.load(accessToken, role)
    expect(thisResponse).toEqual(mockAccountModel())
  })

  test('Should throw if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockRejectedValueOnce(new Error())
    const { accessToken, role } = mockAccountModel()
    const thisResponse = sut.load(accessToken, role)
    await expect(thisResponse).rejects.toThrow()
  })

  test('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockRejectedValueOnce(new Error())
    const { accessToken, role } = mockAccountModel()
    const thisResponse = sut.load(accessToken, role)
    await expect(thisResponse).rejects.toThrow()
  })
})
