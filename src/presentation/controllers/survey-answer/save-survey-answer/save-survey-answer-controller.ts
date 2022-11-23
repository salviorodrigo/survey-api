import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyById
} from './save-survey-answer-controller-protocols'
import { InvalidParamError } from '@/presentation/errors'
import { badRequest, serverError } from '@/presentation/helpers/http/http-helper'

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
      const { surveyId } = httpRequest.params
      if (!thisResponse.filled) {
        const survey = await this.surveyLoader.loadById(surveyId)
        if (!survey) {
          thisResponse.data = badRequest(new InvalidParamError('surveyId'))
          thisResponse.filled = true
        }
      }
    } catch (error) {
      thisResponse.data = serverError(error)
      thisResponse.filled = true
    }
    return thisResponse.data
  }
}
