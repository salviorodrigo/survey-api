import { SurveyMongoRepository } from './survey-mongo-repository'
import {
  AddSurveyModel,
  SurveyAnswerOptionModel
} from './survey-mongo-repository-protocols'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import MockDate from 'mockdate'

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

const makeFakeSurveyAnswerOptions = (): SurveyAnswerOptionModel[] => {
  return [{
    answer: 'any_answer',
    imagePath: 'https://image.path/locale.jpg'
  }, {
    answer: 'another_answer'
  }]
}

const makeFakeSurveyData = (): AddSurveyModel => ({
  question: 'any_question',
  answerOptions: makeFakeSurveyAnswerOptions(),
  date: new Date()
})

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

describe('Survey Mongo Repository', () => {
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

  describe('loadAll()', () => {
    test('Should load all polls on success ', async () => {
      await surveyCollection.insertMany([
        makeFakeSurveyData(),
        makeFakeSurveyData()
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
      const fakeSurvey = makeFakeSurveyData()
      const id = await (
        await surveyCollection.insertOne(fakeSurvey)
      ).ops[0]._id
      const sut = makeSut()
      const survey = await sut.loadById(id)

      expect(survey.id).toBeTruthy()
      expect(survey.question).toEqual(fakeSurvey.question)
      expect(survey.answerOptions).toEqual(fakeSurvey.answerOptions)
      expect(survey.date).toEqual(fakeSurvey.date)
    })

    test('Should return null if survey.id doesn\'t exists', async () => {
      const sut = makeSut()
      const survey = await sut.loadById('an_invalidId')

      expect(survey).toBeNull()
    })
  })
})
