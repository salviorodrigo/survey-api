import { AddAccountParams } from '@/domain/usecases/account/add-account'
import { AccountModel } from '@/data/usecases/account/add-account/db-add-account-protocols'

export interface AddAccountRepository {
  add (accountData: AddAccountParams): Promise<AccountModel>
}
