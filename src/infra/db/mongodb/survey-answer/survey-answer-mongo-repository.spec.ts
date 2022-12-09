import { SurveyAnswerMongoRepository } from './survey-answer-mongo-repository'
import {
  SaveSurveyAnswerParams,
  AccountModel,
  SurveyModel
} from './survey-answer-mongo-repository-protocols'
import { SurveyAnswerModel } from '@/domain/models/survey-answer'
import { mockAddAccountParams } from '@/domain/usecases/account/mocks'
import { mockAddSurveyParams } from '@/domain/usecases/survey/mocks'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import MockDate from 'mockdate'

let accountCollection: Collection
let surveyCollection: Collection
let surveyAnswerCollection: Collection

beforeAll(async () => {
  await MongoHelper.connect(process.env.MONGO_URL as string)
  MockDate.set(new Date())
})

afterAll(async () => {
  await MongoHelper.disconnect()
  MockDate.reset()
})

beforeEach(async () => {
  accountCollection = await MongoHelper.getCollection('account')
  surveyCollection = await MongoHelper.getCollection('polls')
  surveyAnswerCollection = await MongoHelper.getCollection('survey_answers')
  await accountCollection.deleteMany({})
  await surveyCollection.deleteMany({})
  await surveyAnswerCollection.deleteMany({})
})

const createFakeAccount = async (): Promise<AccountModel> => {
  const accountId = (await accountCollection.insertOne(mockAddAccountParams())).insertedId
  const account = await accountCollection.findOne(accountId)
  return MongoHelper.map(account)
}

const createFakeSurvey = async (): Promise<SurveyModel> => {
  const surveyId = (await surveyCollection.insertOne(mockAddSurveyParams())).insertedId
  const survey = await surveyCollection.findOne(surveyId)
  return MongoHelper.map(survey)
}

const makeFakeSurveyAnswerData = async (): Promise<SaveSurveyAnswerParams> => {
  const fakeAccount = await createFakeAccount()
  const fakeSurvey = await createFakeSurvey()
  return {
    accountId: fakeAccount.id,
    surveyId: fakeSurvey.id,
    answer: fakeSurvey.answerOptions[0].answer
  }
}

const createFakeSurveyAnswer = async (surveyAnswerData: SaveSurveyAnswerParams): Promise<SurveyAnswerModel> => {
  const surveyAnswerId = (await surveyAnswerCollection.insertOne(
    Object.assign({}, surveyAnswerData, { date: new Date() })
  )).insertedId
  const surveyAnswer = await surveyAnswerCollection.findOne(surveyAnswerId)
  return MongoHelper.map(surveyAnswer)
}

const makeSut = (): SurveyAnswerMongoRepository => {
  return new SurveyAnswerMongoRepository()
}

describe('SurveyAnswer Mongo Repository', () => {
  test('Should add a survey answer if her is new', async () => {
    const sut = makeSut()

    const fakeSurveyAnswerData = await makeFakeSurveyAnswerData()
    const surveyAnswer = await sut.save(fakeSurveyAnswerData)

    expect(surveyAnswer).toBeTruthy()
    expect(surveyAnswer.id).toBeTruthy()
    expect(surveyAnswer.accountId).toEqual(fakeSurveyAnswerData.accountId)
    expect(surveyAnswer.surveyId).toEqual(fakeSurveyAnswerData.surveyId)
    expect(surveyAnswer.answer).toEqual(fakeSurveyAnswerData.answer)
  })

  test('Should update a survey answer if her isn\'t new', async () => {
    const sut = makeSut()

    const fakeSurveyAnswerData = await makeFakeSurveyAnswerData()
    const fakeSurveyAnswer = await createFakeSurveyAnswer(fakeSurveyAnswerData)
    const surveyAnswer = await sut.save(fakeSurveyAnswerData)

    expect(surveyAnswer).toBeTruthy()
    expect(surveyAnswer.id).toEqual(fakeSurveyAnswer.id)
    expect(surveyAnswer.accountId).toEqual(fakeSurveyAnswerData.accountId)
    expect(surveyAnswer.surveyId).toEqual(fakeSurveyAnswerData.surveyId)
    expect(surveyAnswer.answer).toEqual(fakeSurveyAnswerData.answer)
  })
})
