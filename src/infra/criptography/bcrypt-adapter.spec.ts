import { BcryptAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise((resolve, reject) => resolve('hash'))
  }
}))

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct values', async () => {
    const value = 'any_value'
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.encrypt(value)
    expect(hashSpy).toHaveBeenCalledWith(value, salt)
  })

  test('Should return a hash on success', async () => {
    const value = 'any_value'
    const salt = 12
    const sut = new BcryptAdapter(salt)

    const hash = await sut.encrypt(value)
    expect(hash).toEqual('hash')
  })
})
