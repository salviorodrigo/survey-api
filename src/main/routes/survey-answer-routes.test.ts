import app from '@/main/config/app'
import request from 'supertest'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { SurveyAnswerOptionModel } from '@/domain/models'
import { AddSurveyModel } from '@/domain/usecases/survey'
import { sign } from 'jsonwebtoken'
import env from '@/main/config/env'

let surveyCollection: Collection
let accountCollection: Collection

beforeAll(async () => {
  await MongoHelper.connect(process.env.MONGO_URL)
})

afterAll(async () => {
  await MongoHelper.disconnect()
})

beforeEach(async () => {
  surveyCollection = await MongoHelper.getCollection('polls')
  accountCollection = await MongoHelper.getCollection('accounts')
  await surveyCollection.deleteMany({})
  await accountCollection.deleteMany({})
})

const makeAccessToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'hash_password'
  })
  const id = res.ops[0]._id
  const accessToken = sign({ id }, env.jwtSecret)
  await accountCollection.updateOne({
    _id: id
  }, {
    $set: {
      accessToken
    }
  })

  return accessToken
}

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

const fakeSurveyAnswerData = {
  answer: 'any_answer'
}

describe('Survey Routes', () => {
  describe('PUT /polls/:surveyId/answers', () => {
    test('Should return 403 on save survey without accessToken', async () => {
      await request(app)
        .put('/api/polls/any_id/answers')
        .send(fakeSurveyAnswerData)
        .expect(403)
    })

    test('Should return 200 on save survey with accessToken', async () => {
      const accessToken = await makeAccessToken()
      const surveyId: string = (await surveyCollection.insertOne(
        makeFakeSurveyData()
      )).ops[0]._id

      await request(app)
        .put(`/api/polls/${surveyId}/answers`)
        .set('x-access-token', accessToken)
        .send(fakeSurveyAnswerData)
        .expect(200)
    })
  })
})
