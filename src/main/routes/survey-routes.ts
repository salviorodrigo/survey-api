import { adminAuth } from '@/main/middlewares/adminAuth'
import { auth } from '@/main/middlewares/auth'
import { makeLoadPollsController } from '@/main/factories/controllers/survey/load-polls/load-polls-controller-factory'
import { makeAddSurveyController } from '@/main/factories/controllers/survey/add-survey/add-survey-controller-factory'
import { adaptRoute } from '@/main/adapters/express-route-adapter'
import { Router } from 'express'

export default (router: Router): void => {
  router.post('/polls', adminAuth, (adaptRoute(makeAddSurveyController())))
  router.get('/polls', auth, (adaptRoute(makeLoadPollsController())))
}
