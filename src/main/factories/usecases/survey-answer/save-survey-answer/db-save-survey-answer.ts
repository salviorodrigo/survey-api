import { SaveSurveyAnswer } from '@/domain/usecases/survey-answer'
import { DbSaveSurveyAnswer } from '@/data/usecases/survey-answer/save-survey-answer/db-save-survey-answer'
import { SurveyAnswerMongoRepository } from '@/infra/db/mongodb/survey-answer/survey-answer-mongo-repository'

export const makeDbSaveSurveyAnswer = (): SaveSurveyAnswer => {
  const saveSurveyAnswerRepository = new SurveyAnswerMongoRepository()
  return new DbSaveSurveyAnswer(saveSurveyAnswerRepository)
}
