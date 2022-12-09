import { mockAddSurveyParams } from '@/domain/usecases/survey/mocks'
import { mockAddAccountParams } from '@/domain/usecases/account/mocks'
import { mockSaveSurveyAnswerParams } from '@/domain/usecases/survey-answer/mocks'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import app from '@/main/config/app'
import env from '@/main/config/env'
import request from 'supertest'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'

let surveyCollection: Collection
let accountCollection: Collection

beforeAll(async () => {
  await MongoHelper.connect(process.env.MONGO_URL as string)
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
  const res = await accountCollection.insertOne(mockAddAccountParams())
  const id = res.insertedId
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

describe('Survey Routes', () => {
  describe('PUT /polls/:surveyId/answers', () => {
    test('Should return 403 on save survey without accessToken', async () => {
      await request(app)
        .put('/api/polls/any_id/answers')
        .send(mockSaveSurveyAnswerParams())
        .expect(403)
    })

    test('Should return 200 on save survey with accessToken', async () => {
      const accessToken = await makeAccessToken()
      const surveyId = (await surveyCollection.insertOne(
        Object.assign({}, mockAddSurveyParams(), { date: new Date() })
      )).insertedId.toString()

      await request(app)
        .put(`/api/polls/${surveyId}/answers`)
        .set('x-access-token', accessToken)
        .send({ answer: mockSaveSurveyAnswerParams().answer })
        .expect(200)
    })
  })
})
