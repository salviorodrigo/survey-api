import { Validator, HttpRequest, AddSurvey, Controller, HttpResponse } from './add-survey-protocols'
import { badRequest } from '../../../helpers/http/http-helper'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validator: Validator,
    private readonly addSurvey: AddSurvey
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

    const { question, answers } = httpRequest.body

    if (!thisResponse.filled) {
      await this.addSurvey.add({
        question,
        answers
      })
      thisResponse.filled = true
    }

    return await Promise.resolve(thisResponse.data)
  }
}
