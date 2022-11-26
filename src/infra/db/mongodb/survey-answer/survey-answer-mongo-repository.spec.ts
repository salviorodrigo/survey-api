import { SurveyAnswerMongoRepository } from './survey-answer-mongo-repository'
import {
  SaveSurveyAnswerParams,
  AccountModel,
  SurveyModel
} from './survey-answer-mongo-repository-protocols'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import MockDate from 'mockdate'
import { SurveyAnswerModel } from '@/domain/models/survey-answer'

let accountCollection: Collection
let surveyCollection: Collection
let surveyAnswerCollection: Collection

beforeAll(async () => {
  await MongoHelper.connect(process.env.MONGO_URL)
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
  const account = await (await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'hash_password'
  })).ops[0]

  return MongoHelper.map(account)
}

const createFakeSurvey = async (): Promise<SurveyModel> => {
  const survey = await (await surveyCollection.insertOne({
    question: 'any_question',
    answerOptions: [{
      answer: 'any_answer',
      imagePath: 'https://image.path/locale.jpg'
    }, {
      answer: 'another_answer'
    }],
    date: new Date()
  })).ops[0]
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
  return MongoHelper.map(await (
    await surveyAnswerCollection.insertOne(
      Object.assign({}, surveyAnswerData, { date: new Date() })
    )
  ).ops[0])
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
