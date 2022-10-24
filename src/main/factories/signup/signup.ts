import { Controller } from '../../../presentation/protocols'
import { SignUpController } from '../../../presentation/controllers/signup/signup'
import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../../infra/cryptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/account'
import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log'
import { LogControllerDecorator } from '../../decorators/log'
import { makeSignUpValidator } from './signup-validator'
import env from '../../config/env'

export const makeSignUpController = (): Controller => {
  const bcryptAdapter = new BcryptAdapter(env.saltFromEncrypter)
  const addAccountRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, addAccountRepository)
  const signUpController = new SignUpController(dbAddAccount, makeSignUpValidator())
  const logRepository = new LogMongoRepository()
  const logControllerDecorator = new LogControllerDecorator(signUpController, logRepository)
  return logControllerDecorator
}
