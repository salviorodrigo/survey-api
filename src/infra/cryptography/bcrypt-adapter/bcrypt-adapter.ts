import { Hasher } from '../../../data/protocols/cryptography/hasher'
import bcrypt from 'bcrypt'
import { HashComparer } from '../../../data/protocols/cryptography/hash-comparer'

export class BcryptAdapter implements Hasher, HashComparer {
  constructor (private readonly salt: number) {}

  async hash (value: string): Promise<string> {
    const thisResponse = await bcrypt.hash(value, this.salt)
    return thisResponse
  }

  async compare (value: string, hash: string): Promise<boolean> {
    const thisResponse = await bcrypt.compare(value, hash)
    return thisResponse
  }
}
