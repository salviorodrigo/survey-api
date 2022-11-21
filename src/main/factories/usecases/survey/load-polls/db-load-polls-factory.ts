import { LoadPolls } from '@/domain/usecases/survey/load-polls'
import { DbLoadPolls } from '@/data/usecases/survey/load-polls/db-load-polls'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbLoadPolls = (): LoadPolls => {
  const addSurveyRepository = new SurveyMongoRepository()
  return new DbLoadPolls(addSurveyRepository)
}
