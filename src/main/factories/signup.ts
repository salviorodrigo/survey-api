import { Controller } from '../../presentation/protocols'
import { SignUpController } from '../../presentation/controllers/signup/signup'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { LogControllerDecorator } from './../decorators/log'
import env from '../config/env'

export const makeSignUpController = (): Controller => {
  const bcryptAdapter = new BcryptAdapter(env.saltFromEncrypter)
  const addAccountRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, addAccountRepository)
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const signUpController = new SignUpController(emailValidatorAdapter, dbAddAccount)
  const logControllerDecorator = new LogControllerDecorator(signUpController)
  return logControllerDecorator
}
