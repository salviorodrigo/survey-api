import {
  Authenticator,
  AuthenticatorModel,
  HashComparer,
  TokenGenerator,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository
} from './db-authenticator-protocols'

export class DbAuthenticator implements Authenticator {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer
  private readonly tokenGenerator: TokenGenerator
  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository

  constructor (
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparer,
    tokenGenerator: TokenGenerator,
    updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
    this.tokenGenerator = tokenGenerator
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async auth (credentials: AuthenticatorModel): Promise<string> {
    let accessToken = null
    const account = await this.loadAccountByEmailRepository.load(credentials.email)
    const validation = await this.hashComparer.compare(credentials.password, account?.password ?? 'fakeHash')
    if (validation && account) {
      accessToken = await this.tokenGenerator.generate(account.id)
      await this.updateAccessTokenRepository.update(account.id, accessToken)
    }
    return await new Promise(resolve => resolve(accessToken))
  }
}
