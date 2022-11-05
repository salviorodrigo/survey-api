import { RequestHandler, Router } from 'express'
import { makeSignUpController } from '../factories/controllers/auth/signup/signup-controller-factory'
import { makeLoginController } from '../factories/controllers/auth/login/login-controller-factory'
import { adaptRoute } from '../adapters/express/express-route-adapter'

export default (router: Router): void => {
  router.post('/signup', (adaptRoute(makeSignUpController())) as RequestHandler)
  router.post('/login', (adaptRoute(makeLoginController())) as RequestHandler)
}
