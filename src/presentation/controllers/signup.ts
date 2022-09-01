import { HttpRequest, HttpResponse } from '../presentation/http'
import { MissingParamError } from './../erros/missing-param-error'

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    let getResponse: any
    if (!httpRequest.body.name) {
      const response = {
        statusCode: 400,
        body: new MissingParamError('name')
      }
      getResponse = function () {
        return response
      }
    }
    if (!httpRequest.body.email) {
      const response = {
        statusCode: 400,
        body: new MissingParamError('email')
      }
      getResponse = function () {
        return response
      }
    }
    return getResponse()
  }
}
