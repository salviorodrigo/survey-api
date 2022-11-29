import { Hasher } from './hasher'

export const mockHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await Promise.resolve('hash_value')
    }
  }
  return new HasherStub()
}
