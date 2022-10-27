import { Hasher } from '../../data/protocols/cryptography/hasher'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Hasher {
  private readonly salt: number
  constructor (salt: number) {
    this.salt = salt
  }

  async hash (value: string): Promise<string> {
    const thisResponse = await bcrypt.hash(value, this.salt)
    return thisResponse
  }
}
