import {
  AddSurveyParams,
  SurveyModel,
  AddSurveyRepository,
  LoadPollsRepository,
  LoadSurveyById
} from './survey-mongo-repository-protocols'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { ObjectId } from 'mongodb'

export class SurveyMongoRepository implements AddSurveyRepository, LoadPollsRepository, LoadSurveyById {
  async add (surveyData: AddSurveyParams): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('polls')
    await surveyCollection.insertOne(surveyData)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('polls')
    const polls = await surveyCollection.find().toArray()

    return polls.map(item => MongoHelper.map(item))
  }

  async loadById (id: string): Promise<SurveyModel | null> {
    const thisResponse = {
      filled: false,
      data: null
    }

    if (!thisResponse.filled) {
      const surveyCollection = await MongoHelper.getCollection('polls')
      const survey = await surveyCollection.findOne({ _id: new ObjectId(id) })
      if (survey) {
        thisResponse.data = MongoHelper.map(survey)
        thisResponse.filled = true
      }
    }

    return thisResponse.data
  }
}
