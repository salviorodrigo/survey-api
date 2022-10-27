import { Authenticator, AuthenticatorModel } from '../../../domain/usecases/authenticator'
import { HashComparer } from '../../protocols/cryptography/hash-comparer'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthenticator implements Authenticator {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer

  constructor (loadAccountByEmailRepository: LoadAccountByEmailRepository, hashComparer: HashComparer) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
  }

  async auth (credentials: AuthenticatorModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(credentials.email)
    await this.hashComparer.compare(credentials.password, account?.password ?? 'fakeHash')

    return await new Promise(resolve => resolve(null))
  }
}
