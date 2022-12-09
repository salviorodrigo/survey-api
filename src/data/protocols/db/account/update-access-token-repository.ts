export interface UpdateAccessTokenRepository {
  updateAccessToken (id: string | undefined, token: string): Promise<void>
}
