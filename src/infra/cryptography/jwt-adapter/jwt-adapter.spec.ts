import { JwtAdapter } from './jwt-adapter'
import jwt from 'jsonwebtoken'

describe('Jwt Adapter', () => {
  test('Should call sign with correct value', async () => {
    const sut = new JwtAdapter('secret_key')
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('valid_id')
    expect(signSpy).toHaveBeenCalledWith({ id: 'valid_id' }, 'secret_key')
  })
})
