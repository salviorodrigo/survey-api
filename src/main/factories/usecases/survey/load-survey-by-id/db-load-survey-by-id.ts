import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'
import { LoadSurveyById } from '@/domain/usecases/survey'
import { DbLoadSurveyById } from '@/data/usecases/survey/load-survey-by-id/db-load-survey-by-id'

export const makeDbLoadSurveyById = (): LoadSurveyById => {
  const addSurveyRepository = new SurveyMongoRepository()
  return new DbLoadSurveyById(addSurveyRepository)
}
