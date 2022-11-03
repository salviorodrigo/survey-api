export class EmailTakenError extends Error {
  constructor () {
    super('The received email already been taken')
    this.name = 'EmailTakenError'
  }
}
