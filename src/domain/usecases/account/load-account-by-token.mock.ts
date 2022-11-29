import { LoadAccountByToken } from './load-account-by-token'
import { AccountModel, mockAccountModel } from '@/domain/models'

export const mockLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (accessToken: string, role?: string): Promise<AccountModel> {
      return mockAccountModel()
    }
  }
  return new LoadAccountByTokenStub()
}
