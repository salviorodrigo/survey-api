import {
  AccountModel,
  LoadAccountByToken,
  Decrypter,
  LoadAccountByTokenRepository
} from './db-load-account-by-token-protocols'

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
