import { MongoHelper } from './../helpers/mongo-helper'
import { AddAccountRepository } from './../../../../data/protocols/add-account-repository'
import { AddAccountModel } from './../../../../domain/usecases/add-account'
import { AccountModel } from '../../../../domain/models/account'

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    const { _id, ...accountWithoutId } = result.ops[0]
    const account = Object.assign({}, { id: _id }, accountWithoutId)
    return await new Promise(resolve => resolve(account))
  }
}
