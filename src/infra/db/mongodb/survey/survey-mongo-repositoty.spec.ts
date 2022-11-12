import { Collection } from 'mongodb'
import { SurveyMongoRepository } from './survey-mongo-repository'
import { AddSurveyModel } from '../../../../domain/usecases/add-survey'
import { MongoHelper } from '../helpers/mongo-helper'
import MockDate from 'mockdate'

describe('Survey Mongo Repository', () => {
  let surveyCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
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

  const makeFakeSurveyData = (): AddSurveyModel => ({
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }, {
      answer: 'any_answer'
    }],
    date: new Date()
  })

  const makeSut = (): SurveyMongoRepository => {
    return new SurveyMongoRepository()
  }
  describe('add()', () => {
    test('Should add survey on success ', async () => {
      const sut = makeSut()
      const fakeSurveyData = makeFakeSurveyData()
      await sut.add(fakeSurveyData)
      const survey = await surveyCollection.findOne({
        question: fakeSurveyData.question
      })

      expect(survey).toBeTruthy()
    })
  })

  describe('loadALl()', () => {
    test('Should load all polls on success ', async () => {
      await surveyCollection.insertMany([
        makeFakeSurveyData(),
        makeFakeSurveyData()
      ])
      const sut = makeSut()
      const polls = await sut.loadAll()

      expect(polls.length).toBe(2)
    })

    test('Should load empty list', async () => {
      const sut = makeSut()
      const polls = await sut.loadAll()

      expect(polls.length).toBe(0)
    })
  })
})
