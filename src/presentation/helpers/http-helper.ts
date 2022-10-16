import { HttpResponse } from '../protocols/http'
import { ServerError } from '../errors'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: {
    error: error.message
  }
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: {
    error: new ServerError(error.stack).message
  }
})

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})
