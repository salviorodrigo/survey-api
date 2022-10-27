import { Authenticator, AuthenticatorModel } from '../../../domain/usecases/authenticator'
import { HashComparer } from '../../protocols/cryptography/hash-comparer'
import { TokenGenerator } from '../../protocols/cryptography/token-generator'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthenticator implements Authenticator {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer
  private readonly tokenGenerator: TokenGenerator

  constructor (loadAccountByEmailRepository: LoadAccountByEmailRepository, hashComparer: HashComparer, tokenGenerator: TokenGenerator) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
    this.tokenGenerator = tokenGenerator
  }

  async auth (credentials: AuthenticatorModel): Promise<string> {
    let accessToken = null
    const account = await this.loadAccountByEmailRepository.load(credentials.email)
    const validation = await this.hashComparer.compare(credentials.password, account?.password ?? 'fakeHash')
    if (validation && account) {
      accessToken = await this.tokenGenerator.generate(account.id)
    }
    return await new Promise(resolve => resolve(accessToken))
  }
}
