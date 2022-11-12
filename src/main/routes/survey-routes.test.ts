import request from 'supertest'
import app from '../config/app'
import env from '../config/env'
import { sign } from 'jsonwebtoken'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'

describe('Survey Routes', () => {
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

  describe('POST /survey', () => {
    test('Should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/polls')
        .send({
          question: 'Question 1',
          answers: [{
            image: 'http://localhost:5050/image-name.jpg',
            answer: 'Answer 1'
          }, {
            answer: 'Answer 2'
          }]
        })
        .expect(403)
    })

    test('Should return 204 on add survey with valid accessToken', async () => {
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

      await request(app)
        .post('/api/polls')
        .set('x-access-token', accessToken)
        .send({
          question: 'Question 1',
          answers: [{
            image: 'http://localhost:5050/image-name.jpg',
            answer: 'Answer 1'
          }, {
            answer: 'Answer 2'
          }]
        })
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
  })
})
