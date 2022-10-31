import { AddAccount, AddAccountModel, AccountModel, Hasher, AddAccountRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add (account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(account.password)
    const accountData = Object.assign({}, account, { password: hashedPassword })

    const newAccount = await this.addAccountRepository.add(accountData)

    return await new Promise(resolve => resolve(newAccount))
  }
}
