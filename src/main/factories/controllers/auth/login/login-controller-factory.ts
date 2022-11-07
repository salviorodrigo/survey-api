import { makeLoginValidator } from './login-validator-factory'
import { Controller } from '../../../../../presentation/protocols'
import { LoginController } from '../../../../../presentation/controllers/auth/login/login-controller'
import { makeDbAuthenticator } from '../../../usecases/account/authenticator/db-authenticator-factory'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(makeDbAuthenticator(), makeLoginValidator())
  return makeLogControllerDecorator(loginController)
}
