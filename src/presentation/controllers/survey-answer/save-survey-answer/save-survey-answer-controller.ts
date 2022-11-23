import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyById,
  Validator
} from './save-survey-answer-controller-protocols'
import { InvalidParamError } from '@/presentation/errors'
import { badRequest, serverError } from '@/presentation/helpers/http/http-helper'

export class SaveSurveyAnswerController implements Controller {
  constructor (
    private readonly surveyLoader: LoadSurveyById,
    private readonly validator: Validator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const thisResponse = {
      filled: false,
      data: null
    }
    try {
      if (!thisResponse.filled) {
        const validatorErrorBag = this.validator.validate(httpRequest.params)
        if (validatorErrorBag) {
          thisResponse.data = badRequest(validatorErrorBag)
          thisResponse.filled = true
        }
      }

      const { surveyId, answer } = httpRequest.params
      const survey = await this.surveyLoader.loadById(surveyId)

      if (!thisResponse.filled) {
        if (!survey) {
          thisResponse.data = badRequest(new InvalidParamError('surveyId'))
          thisResponse.filled = true
        }
      }
      if (!thisResponse.filled) {
        const surveyAnswerOption = survey.answerOptions.find(item => item.answer === answer)
        if (!surveyAnswerOption) {
          thisResponse.data = badRequest(new InvalidParamError('answer'))
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
