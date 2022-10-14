import { MongoHelper as sut } from './mongo-helper'

beforeAll(async () => {
  await sut.connect(process.env.MONGO_URL)
})

afterAll(async () => {
  await sut.disconnect()
})

describe('Mongo Helper', () => {
  test('Should connect if  mongodb is down', async () => {
    await sut.disconnect()
    const accountCollection = await sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
  })
})
