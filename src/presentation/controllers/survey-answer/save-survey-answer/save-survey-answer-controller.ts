import { serverError } from '@/presentation/helpers/http/http-helper'
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
    const thisResponse = {
      filled: false,
      data: null
    }
    try {
      await this.surveyLoader.loadById(httpRequest.params.surveyId)
    } catch (error) {
      thisResponse.data = serverError(error)
      thisResponse.filled = true
    }
    return thisResponse.data
  }
}
