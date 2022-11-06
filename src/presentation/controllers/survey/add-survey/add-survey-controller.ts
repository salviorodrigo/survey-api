import { Controller, HttpResponse, HttpRequest, Validator } from '../../../protocols'
import { badRequest } from '../../../helpers/http/http-helper'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validator: Validator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const thisResponse = {
      filled: false,
      data: null as HttpResponse
    }

    if (!thisResponse.filled) {
      const validatorErrorBag = this.validator.validate(httpRequest.body)
      if (validatorErrorBag) {
        thisResponse.data = badRequest(validatorErrorBag)
        thisResponse.filled = true
      }
    }

    return await Promise.resolve(thisResponse.data)
  }
}
