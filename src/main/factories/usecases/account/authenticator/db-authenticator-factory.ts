import { Authenticator } from '@/domain/usecases/account'
import { DbAuthenticator } from '@/data/usecases/account/authentication/db-authenticator'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '@/infra/cryptography/jwt-adapter/jwt-adapter'
import env from '@/main/config/env'

export const makeDbAuthenticator = (): Authenticator => {
  const accountMongoRepository = new AccountMongoRepository()
  const hashComparer = new BcryptAdapter(env.saltFromHasher)
  const encrypter = new JwtAdapter(env.jwtSecret)
  return new DbAuthenticator(accountMongoRepository, hashComparer, encrypter, accountMongoRepository)
}
