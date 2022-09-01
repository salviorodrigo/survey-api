import { HttpRequest, HttpResponse } from '../presentation/http'

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    let getResponse: any
    if (!httpRequest.body.name) {
      const response = {
        statusCode: 400,
        body: new Error('Missing param: name')
      }
      getResponse = function () {
        return response
      }
    }
    if (!httpRequest.body.email) {
      const response = {
        statusCode: 400,
        body: new Error('Missing param: email')
      }
      getResponse = function () {
        return response
      }
    }
    return getResponse()
  }
}
