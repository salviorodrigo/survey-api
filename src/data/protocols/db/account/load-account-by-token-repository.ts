import { AccountModel } from '@/domain/models/account'

export interface LoadAccountByTokenRepository {
  loadByToken (token: string | undefined, role?: string): Promise<AccountModel | null>
}
