import {
  Authenticator,
  AuthenticatorParams,
  HashComparer,
  Encrypter,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository
} from './db-authenticator-protocols'

export class DbAuthenticator implements Authenticator {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth (credentials: AuthenticatorParams): Promise<string> {
    const thisResponse = {
      fillable: false,
      accessToken: null
    }

    const account = await this.loadAccountByEmailRepository.loadByEmail(credentials.email)

    if (!thisResponse.fillable) {
      if (!account) {
        thisResponse.accessToken = null
        thisResponse.fillable = true
      }
    }

    if (!thisResponse.fillable) {
      const validation = await this.hashComparer.compare(credentials.password, account.password)
      if (!validation) {
        thisResponse.accessToken = null
        thisResponse.fillable = true
      }
    }

    if (!thisResponse.fillable) {
      thisResponse.accessToken = await this.encrypter.encrypt(account.id)
      thisResponse.fillable = true
      await this.updateAccessTokenRepository.updateAccessToken(account.id, thisResponse.accessToken)
    }

    return await new Promise(resolve => resolve(thisResponse.accessToken))
  }
}
