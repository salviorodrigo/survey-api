import { AddAccountModel } from '@/domain/usecases/account/add-account'
import { AccountModel } from '@/data/usecases/account/add-account/db-add-account-protocols'

export interface AddAccountRepository {
  add (accountData: AddAccountModel): Promise<AccountModel>
}
