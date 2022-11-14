import { AddSurveyModel } from '@/domain/usecases/add-survey'
import { SurveyModel } from '@/domain/models/survey'
import { AddSurveyRepository } from '@/data/usecases/add-survey/db-add-survey-protocols'
import { LoadPollsRepository } from '@/data/protocols/db/survey/load-polls-repository'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository, LoadPollsRepository {
  async add (surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('polls')
    await surveyCollection.insertOne(surveyData)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('polls')
    const polls: SurveyModel[] = await surveyCollection.find().toArray()

    return polls
  }
}
