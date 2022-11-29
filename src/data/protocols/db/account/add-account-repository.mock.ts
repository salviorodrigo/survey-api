import { AddAccountRepository } from './add-account-repository'
import { AccountModel, mockAccountModel } from '@/domain/models'
import { AddAccountParams } from '@/domain/usecases/account'

export const mockAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountParams): Promise<AccountModel> {
      return await Promise.resolve(mockAccountModel())
    }
  }
  return new AddAccountRepositoryStub()
}
