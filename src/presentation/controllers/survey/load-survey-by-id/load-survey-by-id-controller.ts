import { InvalidParamError } from '@/presentation/errors'
import { badRequest, ok, serverError } from '@/presentation/helpers/http/http-helper'
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

    try {
      const { surveyId } = httpRequest.body
      const survey = await this.surveyLoader.loadById(surveyId)

      if (!thisResponse.filled) {
        if (survey) {
          thisResponse.data = ok(survey)
        } else {
          thisResponse.data = badRequest(new InvalidParamError('surveyId'))
        }
        thisResponse.filled = true
      }
    } catch (error) {
      thisResponse.data = serverError(error)
      thisResponse.filled = true
    }

    return await Promise.resolve(thisResponse.data)
  }
}
