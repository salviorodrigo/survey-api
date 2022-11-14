import { AccountModel } from '@/domain/models/account'
import { LoadAccountByToken } from '@/domain/usecases/load-account-by-token'
import { Decrypter } from '@/data/protocols/cryptography/decrypter'
import { LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByIdRepository: LoadAccountByTokenRepository
  ) {}

  async load (accessToken: string, role?: string): Promise<AccountModel | null> {
    const thisResponse = {
      filled: false,
      data: null
    }
    let account: AccountModel | null

    if (!thisResponse.filled) {
      const decryptToken = await this.decrypter.decrypt(accessToken)
      if (!decryptToken) {
        thisResponse.data = null
        thisResponse.filled = true
      }
    }

    if (!thisResponse.filled) {
      account = await this.loadAccountByIdRepository.loadByToken(accessToken, role)
      if (!account) {
        thisResponse.data = null
        thisResponse.filled = true
      } else {
        thisResponse.data = account
        thisResponse.filled = true
      }
    }

    return thisResponse.data
  }
}
