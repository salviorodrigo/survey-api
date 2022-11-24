import { makeSaveSurveyAnswerValidator } from './save-survey-answer-validator-factory'
import { Controller } from '@/presentation/protocols'
import { SaveSurveyAnswerController } from '@/presentation/controllers/survey-answer/save-survey-answer/save-survey-answer-controller'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeDbLoadSurveyById } from '@/main/factories/usecases/survey/load-survey-by-id/db-load-survey-by-id'
import { makeDbSaveSurveyAnswer } from '@/main/factories/usecases/survey-answer/save-survey-answer/db-save-survey-answer'

export const makeSaveSurveyAnswerController = (): Controller => {
  const saveSurveyAnswerController = new SaveSurveyAnswerController(makeDbLoadSurveyById(), makeSaveSurveyAnswerValidator(), makeDbSaveSurveyAnswer())
  return makeLogControllerDecorator(saveSurveyAnswerController)
}
