import { makeLoginValidator } from './login-validator-factory'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { Controller } from '../../../presentation/protocols'
import { LoginController } from '../../../presentation/controllers/login/login-controller'
import { DbAuthenticator } from '../../../data/usecases/authentication/db-authenticator'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { BcryptAdapter } from '../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../infra/cryptography/jwt-adapter/jwt-adapter'
import env from '../../config/env'

export const makeLoginController = (): Controller => {
  const accountMongoRepository = new AccountMongoRepository()
  const hashComparer = new BcryptAdapter(env.saltFromHasher)
  const encrypter = new JwtAdapter(env.jwtSecret)
  const authenticator = new DbAuthenticator(accountMongoRepository, hashComparer, encrypter, accountMongoRepository)
  const loginController = new LoginController(authenticator, makeLoginValidator())
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(loginController, logMongoRepository)
}
