export class ServerError extends Error {
  constructor (errorStack: string) {
    super('Internal server error')
    this.name = 'ServerError'
    this.stack = errorStack
  }
}
