import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeDbLoadPolls } from '@/main/factories/usecases/survey/load-polls/db-load-polls-factory'
import { Controller } from '@/presentation/protocols'
import { LoadPollsController } from '@/presentation/controllers/survey/load-polls/load-polls-controller'

export const makeLoadPollsController = (): Controller => {
  const loadPollsController = new LoadPollsController(makeDbLoadPolls())
  return makeLogControllerDecorator(loadPollsController)
}
