import { LoadAccountByToken } from '../load-account-by-token'
import { AccountModel } from '@/domain/models'
import { mockAccountModel } from '@/domain/models/mocks'

export const mockLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (accessToken: string, role?: string): Promise<AccountModel> {
      return mockAccountModel()
    }
  }
  return new LoadAccountByTokenStub()
}
