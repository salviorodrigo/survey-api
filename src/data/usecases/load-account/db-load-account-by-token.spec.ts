import { Decrypter } from './../../protocols/cryptography/decrypter'
import { DbLoadAccountByToken } from './db-load-account-by-token'

describe('DbLoadAccountByToken Usecase', () => {
  const makeFakeAccessToken = (): any => ({
    fakeAccessToken: 'any_token',
    fakeRole: 'any_role'
  })

  const makeDecrypterStub = (): Decrypter => {
    class DecrypterStub implements Decrypter {
      async decrypt (value: string): Promise<string> {
        return await Promise.resolve('any_value')
      }
    }
    return new DecrypterStub()
  }

  interface SutTypes {
    sut: DbLoadAccountByToken
    decrypterStub: Decrypter
  }
  const makeSut = (): SutTypes => {
    const decrypterStub = makeDecrypterStub()
    const sut = new DbLoadAccountByToken(decrypterStub)
    return {
      sut,
      decrypterStub
    }
  }

  test('Should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    const { fakeAccessToken, fakeRole } = makeFakeAccessToken()
    await sut.load(fakeAccessToken, fakeRole)
    expect(decryptSpy).toHaveBeenCalledWith(fakeAccessToken)
  })
})
