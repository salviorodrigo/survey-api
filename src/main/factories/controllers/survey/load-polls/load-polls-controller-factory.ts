import { Controller } from '../../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'
import { LoadPollsController } from '../../../../../presentation/controllers/survey/load-polls/load-polls-controller'
import { makeDbLoadPolls } from '../../../usecases/survey/load-polls/db-load-polls-factory'

export const makeLoadPollsController = (): Controller => {
  const loadPollsController = new LoadPollsController(makeDbLoadPolls())
  return makeLogControllerDecorator(loadPollsController)
}
