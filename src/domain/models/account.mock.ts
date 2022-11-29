import { AccountModel } from './account'
import { mockAddAccountParams } from '@/domain/usecases/account'

export const mockAccountModel = (): AccountModel => {
  return Object.assign({}, mockAddAccountParams(), {
    id: 'any_id',
    accessToken: 'encrypt_value',
    role: 'any_role'
  })
}
