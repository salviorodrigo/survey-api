import { makeSignUpController } from '@/main/factories/controllers/auth/signup/signup-controller-factory'
import { makeLoginController } from '@/main/factories/controllers/auth/login/login-controller-factory'
import { adaptRoute } from '@/main/adapters/express-route-adapter'
import { RequestHandler, Router } from 'express'

export default (router: Router): void => {
  router.post('/signup', (adaptRoute(makeSignUpController())) as RequestHandler)
  router.post('/login', (adaptRoute(makeLoginController())) as RequestHandler)
}
