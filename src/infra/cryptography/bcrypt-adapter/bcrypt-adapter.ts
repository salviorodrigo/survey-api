import {
  Hasher,
  HashComparer
} from './bcrypt-adapter-protocols'
import bcrypt from 'bcrypt'

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
