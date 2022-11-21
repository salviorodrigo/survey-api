import {
  SaveSurveyAnswerModel,
  SaveSurveyAnswerRepository,
  SurveyAnswerModel
} from '@/data/usecases/save-survey-answer/db-save-survey-answer-protocols'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyAnswerMongoRepository implements SaveSurveyAnswerRepository {
  async save (surveyAnswerData: SaveSurveyAnswerModel): Promise<SurveyAnswerModel> {
    const surveyAnswerCollection = await MongoHelper.getCollection('survey_answers')
    const surveyAnswer = await surveyAnswerCollection.findOneAndUpdate({
      survey_id: surveyAnswerData.survey_id,
      account_id: surveyAnswerData.account_id
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
