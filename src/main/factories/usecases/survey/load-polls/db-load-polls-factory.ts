import { DbLoadPolls } from './../../../../../data/usecases/load-polls/db-load-polls'
import { LoadPolls } from './../../../../../domain/usecases/load-polls'
import { SurveyMongoRepository } from '../../../../../infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbLoadPolls = (): LoadPolls => {
  const addSurveyRepository = new SurveyMongoRepository()
  return new DbLoadPolls(addSurveyRepository)
}
