import {
  SaveSurveyAnswerParams,
  SaveSurveyAnswerRepository,
  SurveyAnswerModel
} from '@/data/usecases/survey-answer/save-survey-answer/db-save-survey-answer-protocols'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyAnswerMongoRepository implements SaveSurveyAnswerRepository {
  async save (surveyAnswerData: SaveSurveyAnswerParams): Promise<SurveyAnswerModel> {
    const surveyAnswerCollection = await MongoHelper.getCollection('survey_answers')
    await surveyAnswerCollection.findOneAndUpdate({
      surveyId: surveyAnswerData.surveyId,
      accountId: surveyAnswerData.accountId
    }, {
      $set: {
        answer: surveyAnswerData.answer,
        date: new Date()
      }
    }, {
      upsert: true
    })
    const surveyAnswer = await surveyAnswerCollection.findOne({
      surveyId: surveyAnswerData.surveyId,
      accountId: surveyAnswerData.accountId
    })
    return MongoHelper.map(surveyAnswer)
  }
}
