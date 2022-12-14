import { BcryptAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('hash'))
  },

  async compare (): Promise<boolean> {
    return await new Promise(resolve => resolve(true))
  }
}))

const salt = 12

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  describe('hash()', () => {
    test('Should call hash with correct values', async () => {
      const value = 'any_value'
      const sut = makeSut()
      const hashSpy = jest.spyOn(bcrypt, 'hash')

      await sut.hash(value)
      expect(hashSpy).toHaveBeenCalledWith(value, salt)
    })

    test('Should return a valid hash on hash success', async () => {
      const value = 'any_value'

      const sut = makeSut()
      const hash = await sut.hash(value)
      expect(hash).toEqual('hash')
    })

    test('Should throws if hash throws', async () => {
      const value = 'any_value'
      const sut = makeSut()
      jest.spyOn(bcrypt, 'hash')
        .mockImplementationOnce(() => {
          throw new Error()
        })

      const response = sut.hash(value)
      await expect(response).rejects.toThrow()
    })
  })

  describe('hash()', () => {
    test('Should call compare with correct values', async () => {
      const sut = makeSut()
      const compareSpy = jest.spyOn(bcrypt, 'compare')

      await sut.compare('any_value', 'any_hash')
      expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
    })

    test('Should return true when compare succeeds', async () => {
      const sut = makeSut()
      const isValid = await sut.compare('any_value', 'any_hash')
      expect(isValid).toEqual(true)
    })

    test('Should return false when compare fails', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(
        jest.fn().mockResolvedValueOnce(false)
      )
      const isValid = await sut.compare('any_value', 'any_hash')
      expect(isValid).toEqual(false)
    })

    test('Should throws if compare throws', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'compare')
        .mockImplementationOnce(() => {
          throw new Error()
        })

      const response = sut.compare('any_value', 'hash_value')
      await expect(response).rejects.toThrow()
    })
  })
})
