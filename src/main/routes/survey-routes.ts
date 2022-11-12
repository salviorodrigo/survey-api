import { makeLoadPollsController } from './../factories/controllers/survey/load-polls/load-polls-controller-factory'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { makeAuthMiddleware } from './../factories/middlewares/auth-middleware-factory'
import { Router } from 'express'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'
import { adaptRoute } from '../adapters/express-route-adapter'

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'))
  const auth = adaptMiddleware(makeAuthMiddleware())
  router.post('/polls', adminAuth, (adaptRoute(makeAddSurveyController())))
  router.get('/polls', auth, (adaptRoute(makeLoadPollsController())))
}
