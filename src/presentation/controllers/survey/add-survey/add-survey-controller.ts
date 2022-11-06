import { Controller, HttpResponse, HttpRequest, Validator } from '../../../protocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validator: Validator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    this.validator.validate(httpRequest.body)
    return await Promise.resolve(null)
  }
}
