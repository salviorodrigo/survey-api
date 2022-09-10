import { AddAccount, AddAccountModel, AccountModel, Encrypter, AddAccountRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly addAccountRepository: AddAccountRepository

  constructor (encrypter: Encrypter, addAccountRepository: AddAccountRepository) {
    this.encrypter = encrypter
    this.addAccountRepository = addAccountRepository
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

    const hashedPassword = await this.encrypter.encrypt(account.password)
    const accountData = Object.assign({}, account, { password: hashedPassword })

    thisResponse.data = Object.assign(thisResponse.data, this.addAccountRepository.add(accountData))

    return await new Promise(resolve => resolve(thisResponse.data))
  }
}
