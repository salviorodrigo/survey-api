import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyById,
  Validator,
  SaveSurveyAnswer
} from './save-survey-answer-controller-protocols'
import { InvalidParamError } from '@/presentation/errors'
import { badRequest, serverError } from '@/presentation/helpers/http/http-helper'

export class SaveSurveyAnswerController implements Controller {
  constructor (
    private readonly surveyLoader: LoadSurveyById,
    private readonly validator: Validator,
    private readonly surveyAnswerSaver: SaveSurveyAnswer
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

      const { surveyId, accountId, answer } = httpRequest.params
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

      if (!thisResponse.filled) {
        await this.surveyAnswerSaver.save({
          surveyId,
          accountId,
          answer
        })
      }
    } catch (error) {
      thisResponse.data = serverError(error)
      thisResponse.filled = true
    }
    return thisResponse.data
  }
}
