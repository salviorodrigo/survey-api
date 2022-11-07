import { Decrypter } from '../../../data/protocols/cryptography/decrypter'
import { Encrypter } from '../../../data/protocols/cryptography/encrypter'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secretKey: string) {}

  async encrypt (value: string): Promise<string> {
    const thisResponse = await jwt.sign({ id: value }, this.secretKey)
    return thisResponse
  }

  async decrypt (token: string): Promise<string | null> {
    const thisResponse: any = await jwt.verify(token, this.secretKey)
    return thisResponse
  }
}
