import { AddAccount, AddAccountParams } from './add-account'
import { AccountModel, mockAccountModel } from '@/domain/models'

export const mockAddAccountParams = (): AddAccountParams => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountParams): Promise<AccountModel> {
      return mockAccountModel()
    }
  }
  return new AddAccountStub()
}
