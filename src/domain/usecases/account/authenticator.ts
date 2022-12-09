export type AuthenticatorParams = {
  email: string
  password: string
}

export interface Authenticator {
  auth (credentials: AuthenticatorParams): Promise<string | undefined>
}
