import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyById
} from './save-survey-answer-controller-protocols'

export class SaveSurveyAnswerController implements Controller {
  constructor (
    private readonly surveyLoader: LoadSurveyById
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.surveyLoader.loadById(httpRequest.params.surveyId)
    return null
  }
}
