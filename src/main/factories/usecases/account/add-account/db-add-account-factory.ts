import { AddAccount } from '@/domain/usecases/account/add-account'
import { DbAddAccount } from '@/data/usecases/account/add-account/db-add-account'
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'
import env from '@/main/config/env'

export const makeDbAddAccount = (): AddAccount => {
  const bcryptAdapter = new BcryptAdapter(env.saltFromHasher)
  const addAccountRepository = new AccountMongoRepository()
  return new DbAddAccount(bcryptAdapter, addAccountRepository, addAccountRepository)
}
