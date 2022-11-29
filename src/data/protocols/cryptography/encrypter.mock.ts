import { Encrypter } from './encrypter'

export const mockEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await Promise.resolve('encrypt_value')
    }
  }
  return new EncrypterStub()
}
