import { HttpResponse } from './../../presentation/http'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})
