import { Authenticator, AuthenticatorModel } from '../../../domain/usecases/authenticator'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthenticator implements Authenticator {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository

  constructor (loadAccountByEmailRepository: LoadAccountByEmailRepository) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
  }

  async auth (credentials: AuthenticatorModel): Promise<string> {
    await this.loadAccountByEmailRepository.load(credentials.email)
    return await new Promise(resolve => resolve(null))
  }
}
