import { mockAddSurveyParams } from '@/domain/usecases/survey'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import app from '@/main/config/app'
import env from '@/main/config/env'
import { sign } from 'jsonwebtoken'
import request from 'supertest'
import { Collection } from 'mongodb'

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
    password: 'hash_password',
    role: 'admin'
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

describe('Survey Routes', () => {
  describe('POST /survey', () => {
    test('Should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/polls')
        .send(mockAddSurveyParams())
        .expect(403)
    })

    test('Should return 204 on add survey with valid accessToken', async () => {
      const accessToken = await makeAccessToken()
      await request(app)
        .post('/api/polls')
        .set('x-access-token', accessToken)
        .send(mockAddSurveyParams())
        .expect(204)
    })
  })

  describe('GET /polls', () => {
    test('Should return 403 on load polls without accessToken', async () => {
      await request(app)
        .get('/api/polls')
        .send({})
        .expect(403)
    })

    test('Should return 204 on load polls if doesn\'t exists polls on database', async () => {
      const accessToken = await makeAccessToken()
      await request(app)
        .get('/api/polls')
        .set('x-access-token', accessToken)
        .send({})
        .expect(204)
    })

    test('Should return 200 on load polls success', async () => {
      const accessToken = await makeAccessToken()
      await surveyCollection.insertMany([
        mockAddSurveyParams()
      ])

      await request(app)
        .get('/api/polls')
        .set('x-access-token', accessToken)
        .send({})
        .expect(200)
    })
  })
})
