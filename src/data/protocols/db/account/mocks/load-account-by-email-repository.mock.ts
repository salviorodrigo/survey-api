import { LoadAccountByEmailRepository } from '../load-account-by-email-repository'
import { AccountModel } from '@/domain/models'
import { mockAccountModel } from '@/domain/models/mocks'

export const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
      return await Promise.resolve(mockAccountModel())
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}
