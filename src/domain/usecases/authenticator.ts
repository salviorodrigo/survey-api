export interface AuthenticationModel {
  email: string
  password: string
}

export interface Authenticator {
  auth (credentials: AuthenticationModel): Promise<string>
}
