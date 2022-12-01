import { LoadAccountByTokenRepository } from '../load-account-by-token-repository'
import { AccountModel } from '@/domain/models'
import { mockAccountModel } from '@/domain/models/mocks'

export const mockLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (token: string, role?: string): Promise<AccountModel> {
      return await Promise.resolve(mockAccountModel())
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}
