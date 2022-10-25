export interface AuthenticatorModel {
  email: string
  password: string
}

export interface Authenticator {
  auth (credentials: AuthenticatorModel): Promise<string>
}
