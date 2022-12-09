import {
  AddAccount,
  AddAccountParams,
  AccountModel,
  Hasher,
  AddAccountRepository,
  LoadAccountByEmailRepository
} from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add (account: AddAccountParams): Promise<AccountModel | null> {
    const thisResponse = {
      filled: false,
      data: null as unknown as AccountModel
    }

    if (!thisResponse.filled) {
      if ((await this.loadAccountByEmailRepository.loadByEmail(account.email)) !== null) {
        thisResponse.filled = true
      }
    }

    if (!thisResponse.filled) {
      const hashedPassword = await this.hasher.hash(account.password)
      const accountData = Object.assign({}, account, { password: hashedPassword })

      thisResponse.data = await this.addAccountRepository.add(accountData)
      thisResponse.filled = true
    }

    return thisResponse.data
  }
}
