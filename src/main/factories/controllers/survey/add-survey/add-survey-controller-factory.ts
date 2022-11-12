import { makeDbAddSurvey } from '../../../usecases/survey/add-survey/db-add-survey-factory'
import { makeAddSurveyValidator } from './add-survey-validator-factory'
import { AddSurveyController } from '../../../../../presentation/controllers/survey/add-survey/add-survey-controller'
import { Controller } from '../../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'

export const makeAddSurveyController = (): Controller => {
  const addSurveyController = new AddSurveyController(makeAddSurveyValidator(), makeDbAddSurvey())
  return makeLogControllerDecorator(addSurveyController)
}
