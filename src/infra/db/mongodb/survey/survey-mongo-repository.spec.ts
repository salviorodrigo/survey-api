import { SurveyMongoRepository } from './survey-mongo-repository'
import { mockSurveyModel } from '@/domain/models/mocks'
import { mockAddSurveyParams } from '@/domain/usecases/survey/mocks'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import MockDate from 'mockdate'

let surveyCollection: Collection

beforeAll(async () => {
  await MongoHelper.connect(process.env.MONGO_URL as string)
  MockDate.set(new Date())
})

afterAll(async () => {
  await MongoHelper.disconnect()
  MockDate.reset()
})

beforeEach(async () => {
  surveyCollection = await MongoHelper.getCollection('polls')
  await surveyCollection.deleteMany({})
})

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

describe('Survey Mongo Repository', () => {
  describe('add()', () => {
    test('Should add survey on success ', async () => {
      const sut = makeSut()
      const fakeSurveyData = mockAddSurveyParams()
      await sut.add(fakeSurveyData)
      const survey = await surveyCollection.findOne({
        question: fakeSurveyData.question
      })

      expect(survey).toBeTruthy()
    })
  })

  describe('loadAll()', () => {
    test('Should load all polls on success ', async () => {
      await surveyCollection.insertMany([
        mockSurveyModel(),
        mockSurveyModel()
      ])
      const sut = makeSut()
      const polls = await sut.loadAll()

      expect(polls.length).toBe(2)
      expect(polls[0].id).toBeTruthy()
    })

    test('Should load empty list', async () => {
      const sut = makeSut()
      const polls = await sut.loadAll()

      expect(polls.length).toBe(0)
    })
  })

  describe('loadById()', () => {
    test('Should load a survey on success', async () => {
      const fakeSurvey = mockAddSurveyParams()
      const id = (
        await surveyCollection.insertOne(fakeSurvey)
      ).insertedId.toString()
      const sut = makeSut()
      const survey = await sut.loadById(id)

      expect(survey?.id).toBeTruthy()
      expect(survey?.question).toEqual(fakeSurvey.question)
      expect(survey?.answerOptions).toEqual(fakeSurvey.answerOptions)
    })

    test('Should return null if survey.id doesn\'t exists', async () => {
      const sut = makeSut()
      const survey = await sut.loadById('an_invalidId')

      expect(survey).toBeNull()
    })
  })
})
