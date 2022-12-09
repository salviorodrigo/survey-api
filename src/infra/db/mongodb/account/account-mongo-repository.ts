import {
  AccountModel,
  AddAccountParams,
  LoadAccountByTokenRepository,
  AddAccountRepository,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository
} from './account-mongo-repository-protocols'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository, LoadAccountByTokenRepository {
  async add (accountData: AddAccountParams): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const accountId = (await accountCollection.insertOne(accountData)).insertedId
    const result = await accountCollection.findOne(accountId)
    const account = MongoHelper.map(result)
    return await Promise.resolve(account)
  }

  async loadByEmail (email: string): Promise<AccountModel | null> {
    let thisResponse = null
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.findOne({ email })
    if (result) {
      thisResponse = MongoHelper.map(result)
    }
    return await Promise.resolve(thisResponse)
  }

  async updateAccessToken (id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne(
      {
        _id: id
      },
      {
        $set: { accessToken: token }
      }
    )
  }

  async loadByToken (token: string, role?: string): Promise<AccountModel | null> {
    let thisResponse = null
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.findOne({
      accessToken: token,
      $or: [{
        role
      }, {
        role: 'admin'
      }]
    })
    if (result) {
      thisResponse = MongoHelper.map(result)
    }
    return await Promise.resolve(thisResponse)
  }
}
