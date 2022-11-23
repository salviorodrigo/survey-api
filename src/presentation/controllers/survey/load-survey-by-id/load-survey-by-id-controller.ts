import { ok } from '@/presentation/helpers/http/http-helper'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyById
} from './load-survey-by-id-controller-protocols'

export class LoadSurveyByIdController implements Controller {
  constructor (
    private readonly surveyLoader: LoadSurveyById
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const thisResponse = {
      filled: false,
      data: null
    }

    const { surveyId } = httpRequest.body

    if (!thisResponse.filled) {
      const survey = await this.surveyLoader.loadById(surveyId)
      if (survey) {
        thisResponse.data = ok(survey)
        thisResponse.filled = true
      }
    }

    return await Promise.resolve(thisResponse.data)
  }
}
