import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository'
import { Decrypter } from './../../protocols/cryptography/decrypter'
import { DbLoadAccountByToken } from './db-load-account-by-token'
import { AccountModel } from '../../../domain/models/account'

describe('DbLoadAccountByToken Usecase', () => {
  const makeFakeAccessToken = (): any => ({
    fakeAccessToken: 'any_token',
    fakeRole: 'any_role'
  })

  const makeFakeDecryptedAccessToken = async (): Promise<any> => {
    return await makeDecrypterStub().decrypt(makeFakeAccessToken().fakeAccessToken)
  }

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
    loadAccountByIdRepositoryStub: LoadAccountByTokenRepository
  }
  const makeSut = (): SutTypes => {
    const decrypterStub = makeDecrypterStub()
    const loadAccountByIdRepositoryStub = makeLoadAccountByTokenRepositoryRepositoryStub()
    const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByIdRepositoryStub)
    return {
      sut,
      decrypterStub,
      loadAccountByIdRepositoryStub
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
    const { sut, loadAccountByIdRepositoryStub } = makeSut()
    const loadByTokenSpy = jest.spyOn(loadAccountByIdRepositoryStub, 'loadByToken')
    const { fakeAccessToken, fakeRole } = makeFakeAccessToken()
    const fakeDecryptedAccessToken = await makeFakeDecryptedAccessToken()
    await sut.load(fakeAccessToken, fakeRole)
    expect(loadByTokenSpy).toHaveBeenCalledWith(fakeDecryptedAccessToken, fakeRole)
  })

  test('Should returns null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByIdRepositoryStub, 'loadByToken').mockResolvedValueOnce(null)
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
    const { sut, loadAccountByIdRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByIdRepositoryStub, 'loadByToken').mockImplementationOnce(() => {
      throw new Error()
    })
    const { fakeAccessToken, fakeRole } = makeFakeAccessToken()
    const thisResponse = sut.load(fakeAccessToken, fakeRole)
    await expect(thisResponse).rejects.toThrow()
  })
})
