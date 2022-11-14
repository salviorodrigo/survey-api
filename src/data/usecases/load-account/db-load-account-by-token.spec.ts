import { DbLoadAccountByToken } from './db-load-account-by-token'
import { AccountModel } from '@/domain/models/account'
import { LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository'
import { Decrypter } from '@/data/protocols/cryptography/decrypter'

describe('DbLoadAccountByToken Usecase', () => {
  const makeFakeAccessToken = (): any => ({
    fakeAccessToken: 'any_token',
    fakeRole: 'any_role'
  })

  const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'hashed_value'
  })

  const makeDecrypterStub = (): Decrypter => {
    class DecrypterStub implements Decrypter {
      async decrypt (value: string): Promise<string | null> {
        return await Promise.resolve('any_value ')
      }
    }
    return new DecrypterStub()
  }

  const makeLoadAccountByTokenRepositoryRepositoryStub = (): LoadAccountByTokenRepository => {
    class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
      async loadByToken (token: string, role?: string): Promise<AccountModel | null> {
        return await Promise.resolve(makeFakeAccount())
      }
    }
    return new LoadAccountByTokenRepositoryStub()
  }

  interface SutTypes {
    sut: DbLoadAccountByToken
    decrypterStub: Decrypter
    loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
  }
  const makeSut = (): SutTypes => {
    const decrypterStub = makeDecrypterStub()
    const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepositoryRepositoryStub()
    const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenRepositoryStub)
    return {
      sut,
      decrypterStub,
      loadAccountByTokenRepositoryStub
    }
  }

  test('Should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    const { fakeAccessToken, fakeRole } = makeFakeAccessToken()
    await sut.load(fakeAccessToken, fakeRole)
    expect(decryptSpy).toHaveBeenCalledWith(fakeAccessToken)
  })

  test('Should returns null if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockResolvedValueOnce(null)
    const { fakeAccessToken, fakeRole } = makeFakeAccessToken()
    const thisResponse = await sut.load(fakeAccessToken, fakeRole)
    expect(thisResponse).toBeNull()
  })

  test('Should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
    const { fakeAccessToken, fakeRole } = makeFakeAccessToken()
    await sut.load(fakeAccessToken, fakeRole)
    expect(loadByTokenSpy).toHaveBeenCalledWith(fakeAccessToken, fakeRole)
  })

  test('Should returns null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockResolvedValueOnce(null)
    const { fakeAccessToken, fakeRole } = makeFakeAccessToken()
    const thisResponse = await sut.load(fakeAccessToken, fakeRole)
    expect(thisResponse).toBeNull()
  })

  test('Should returns an account on success', async () => {
    const { sut } = makeSut()
    const { fakeAccessToken, fakeRole } = makeFakeAccessToken()
    const thisResponse = await sut.load(fakeAccessToken, fakeRole)
    expect(thisResponse).toEqual(makeFakeAccount())
  })

  test('Should throw if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockImplementationOnce(() => {
      throw new Error()
    })
    const { fakeAccessToken, fakeRole } = makeFakeAccessToken()
    const thisResponse = sut.load(fakeAccessToken, fakeRole)
    await expect(thisResponse).rejects.toThrow()
  })

  test('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockImplementationOnce(() => {
      throw new Error()
    })
    const { fakeAccessToken, fakeRole } = makeFakeAccessToken()
    const thisResponse = sut.load(fakeAccessToken, fakeRole)
    await expect(thisResponse).rejects.toThrow()
  })
})
