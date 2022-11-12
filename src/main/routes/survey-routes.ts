import { adminAuth } from './../middlewares/adminAuth'
import { auth } from './../middlewares/auth'
import { makeLoadPollsController } from './../factories/controllers/survey/load-polls/load-polls-controller-factory'
import { Router } from 'express'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'
import { adaptRoute } from '../adapters/express-route-adapter'

export default (router: Router): void => {
  router.post('/polls', adminAuth, (adaptRoute(makeAddSurveyController())))
  router.get('/polls', auth, (adaptRoute(makeLoadPollsController())))
}
