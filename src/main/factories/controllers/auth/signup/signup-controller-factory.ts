import { Controller } from '@/presentation/protocols'
import { SignUpController } from '@/presentation/controllers/auth/signup/signup-controller'
import { makeSignUpValidator } from '@/main/factories/controllers/auth/signup/signup-validator-factory'
import { makeDbAddAccount } from '@/main/factories/usecases/account/add-account/db-add-account-factory'
import { makeDbAuthenticator } from '@/main/factories/usecases/account/authenticator/db-authenticator-factory'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'

export const makeSignUpController = (): Controller => {
  const signUpController = new SignUpController(makeDbAddAccount(), makeSignUpValidator(), makeDbAuthenticator())
  return makeLogControllerDecorator(signUpController)
}
