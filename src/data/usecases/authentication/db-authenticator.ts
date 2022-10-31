import {
  Authenticator,
  AuthenticatorModel,
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

  async auth (credentials: AuthenticatorModel): Promise<string> {
    let accessToken = null
    const account = await this.loadAccountByEmailRepository.loadByEmail(credentials.email)
    const validation = await this.hashComparer.compare(credentials.password, account?.password ?? 'fakeHash')
    if (validation && account) {
      accessToken = await this.encrypter.encrypt(account.id)
      await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken)
    }
    return await new Promise(resolve => resolve(accessToken))
  }
}
