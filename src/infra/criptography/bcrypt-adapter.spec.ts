import { BcryptAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('hash'))
  }
}))

const salt = 12

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct values', async () => {
    const value = 'any_value'
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.encrypt(value)
    expect(hashSpy).toHaveBeenCalledWith(value, salt)
  })

  test('Should return a hash on success', async () => {
    const value = 'any_value'

    const sut = makeSut()
    const hash = await sut.encrypt(value)
    expect(hash).toEqual('hash')
  })

  test('Should throws if bcrypt throws', async () => {
    const value = 'any_value'
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash')
      .mockImplementationOnce(() => {
        throw new Error()
      })

    const response = sut.encrypt(value)
    await expect(response).rejects.toThrow()
  })
})
