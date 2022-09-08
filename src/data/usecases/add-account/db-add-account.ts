import { AddAccount, AddAccountModel } from './../../../domain/usecases/add-account'
import { AccountModel } from './../../../domain/models/account'
import { Encrypter } from '../../protocols/encrypter'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter

  constructor (encrypter: Encrypter) {
    this.encrypter = encrypter
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    const thisResponse = {
      filled: false,
      data: {
        id: '',
        name: '',
        email: '',
        password: ''
      }
    }
    if (!thisResponse.filled) {
      thisResponse.data.id = 'valid_id'
      thisResponse.data.name = account.name
      thisResponse.data.email = account.email
      thisResponse.data.password = await this.encrypter.encrypt(account.password)
    }

    return await new Promise(resolve => resolve(thisResponse.data))
  }
}
