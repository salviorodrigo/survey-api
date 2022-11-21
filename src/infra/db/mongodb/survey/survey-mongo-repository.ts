import { AddSurveyModel } from '@/domain/usecases/add-survey'
import { SurveyModel } from '@/domain/models/survey'
import { AddSurveyRepository } from '@/data/usecases/add-survey/db-add-survey-protocols'
import { LoadPollsRepository } from '@/data/protocols/db/survey/load-polls-repository'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { LoadSurveyById } from '@/domain/usecases/load-survey-by-id'

export class SurveyMongoRepository implements AddSurveyRepository, LoadPollsRepository, LoadSurveyById {
  async add (surveyData: AddSurveyModel): Promise<void> {
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
      const survey = await surveyCollection.findOne({ _id: id })
      if (survey) {
        thisResponse.data = MongoHelper.map(survey)
        thisResponse.filled = true
      }
    }

    return thisResponse.data
  }
}
