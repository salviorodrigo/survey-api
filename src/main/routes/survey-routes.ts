import { RequestHandler, Router } from 'express'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey-controller-factory'
import { adaptRoute } from '../adapters/express-route-adapter'

export default (router: Router): void => {
  router.post('/polls', (adaptRoute(makeAddSurveyController())) as RequestHandler)
}
