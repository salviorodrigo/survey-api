import { badRequest } from './helpers/http-helper'
import { HttpRequest, HttpResponse } from '../presentation/http'
import { MissingParamError } from './../erros/missing-param-error'

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    let thisResponse: any
    if (!httpRequest.body.name) {
      thisResponse = badRequest(new MissingParamError('name'))
    }
    if (!httpRequest.body.email) {
      thisResponse = badRequest(new MissingParamError('email'))
    }
    return thisResponse
  }
}
