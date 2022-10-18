export class UnauthorizedError extends Error {
  constructor () {
    super('Invalid credentials was provided')
    this.name = 'UnauthorizedError'
  }
}
