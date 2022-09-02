import { badRequest } from './helpers/http-helper'
import { HttpRequest, HttpResponse } from '../protocols/http'
import { MissingParamError } from './../erros/missing-param-error'

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    const thisResponse = {
      filled: false,
      data: {
        statusCode: 200,
        body: {}
      }
    }
    const requiredFields = ['name', 'email', 'password']
    if (!thisResponse.filled) {
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          thisResponse.data = badRequest(new MissingParamError(field))
          thisResponse.filled = true
        }
      }
    }
    return thisResponse.data
  }
}
