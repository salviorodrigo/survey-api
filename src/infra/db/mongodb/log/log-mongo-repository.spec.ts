import { LogMongoRepository } from './log-mongo-repository'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'

let errorCollection: Collection

beforeAll(async () => {
  await MongoHelper.connect(process.env.MONGO_URL as string)
})

afterAll(async () => {
  await MongoHelper.disconnect()
})

beforeEach(async () => {
  errorCollection = await MongoHelper.getCollection('errors')
  await errorCollection.deleteMany({})
})

const makeSut = (): LogMongoRepository => {
  return new LogMongoRepository()
}

describe('Log Mongo Repository', () => {
  test('Should create an error log on success', async () => {
    const sut = makeSut()
    await sut.logError('any_error')

    const errorDocuments = await errorCollection.countDocuments()
    expect(errorDocuments).toBe(1)
  })
})
