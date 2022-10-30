import { JwtAdapter } from './jwt-adapter'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return await new Promise(resolve => resolve('valid_token'))
  }
}))

describe('Jwt Adapter', () => {
  test('Should call sign with correct value', async () => {
    const sut = new JwtAdapter('secret_key')
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('valid_id')
    expect(signSpy).toHaveBeenCalledWith({ id: 'valid_id' }, 'secret_key')
  })

  test('Should return a token on success', async () => {
    const sut = new JwtAdapter('secret_key')
    const thisResponse = await sut.encrypt('valid_id')
    expect(thisResponse).toBe('valid_token')
  })

  test('Should throw if sign throws', async () => {
    const sut = new JwtAdapter('secret_key')
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error()
    })
    const thisResponse = sut.encrypt('valid_id')
    await expect(thisResponse).rejects.toThrow()
  })
})
