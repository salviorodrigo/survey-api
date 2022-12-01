import { Authenticator, AuthenticatorParams } from '../authenticator'
import { mockAccountModel } from '@/domain/models/mocks'

export const mockAuthenticatorParams = (): AuthenticatorParams => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

export const mockAuthenticator = (): Authenticator => {
  class AuthenticatorStub implements Authenticator {
    async auth (credentials: AuthenticatorParams): Promise<string> {
      return mockAccountModel().accessToken
    }
  }
  return new AuthenticatorStub()
}
