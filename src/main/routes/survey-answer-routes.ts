import { auth } from '@/main/middlewares/auth'
import { adaptRoute } from '@/main/adapters/express-route-adapter'
import { makeSaveSurveyAnswerController } from '@/main/factories/controllers/survey-answer/save-survey-answer/save-survey-answer-controller-factory'
import { Router } from 'express'

export default (router: Router): void => {
  router.put('/surveys/:surveyId/answers', auth, (adaptRoute(makeSaveSurveyAnswerController())))
}
