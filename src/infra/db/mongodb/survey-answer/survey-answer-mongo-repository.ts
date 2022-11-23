import {
  SaveSurveyAnswerModel,
  SaveSurveyAnswerRepository,
  SurveyAnswerModel
} from '@/data/usecases/survey-answer/save-survey-answer/db-save-survey-answer-protocols'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyAnswerMongoRepository implements SaveSurveyAnswerRepository {
  async save (surveyAnswerData: SaveSurveyAnswerModel): Promise<SurveyAnswerModel> {
    const surveyAnswerCollection = await MongoHelper.getCollection('survey_answers')
    const surveyAnswer = await surveyAnswerCollection.findOneAndUpdate({
      surveyId: surveyAnswerData.surveyId,
      accountId: surveyAnswerData.accountId
    }, {
      $set: {
        answer: surveyAnswerData.answer,
        date: new Date()
      }
    }, {
      upsert: true,
      returnOriginal: false
    })
    return MongoHelper.map(surveyAnswer.value)
  }
}
