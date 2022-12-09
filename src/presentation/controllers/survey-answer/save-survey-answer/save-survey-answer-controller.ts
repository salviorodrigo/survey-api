import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyById,
  Validator,
  SaveSurveyAnswer
} from './save-survey-answer-controller-protocols'
import { InvalidParamError } from '@/presentation/errors'
import { ok, badRequest, serverError } from '@/presentation/helpers/http/http-helper'

export class SaveSurveyAnswerController implements Controller {
  constructor (
    private readonly surveyLoader: LoadSurveyById,
    private readonly validator: Validator,
    private readonly surveyAnswerSaver: SaveSurveyAnswer
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const thisResponse = {
      filled: false,
      data: null as unknown as HttpResponse
    }
    try {
      const params = Object.assign({}, httpRequest.params, httpRequest.body, { accountId: httpRequest.accountId })

      if (!thisResponse.filled) {
        const validatorErrorBag = this.validator.validate(params)
        if (validatorErrorBag) {
          thisResponse.data = badRequest(validatorErrorBag)
          thisResponse.filled = true
        }
      }

      const { surveyId, accountId, answer } = params
      const survey = await this.surveyLoader.loadById(surveyId)

      if (!thisResponse.filled) {
        if (!survey) {
          thisResponse.data = badRequest(new InvalidParamError('surveyId'))
          thisResponse.filled = true
        }
      }
      if (!thisResponse.filled) {
        const surveyAnswerOption = survey?.answerOptions.find(item => item.answer === answer)
        if (!surveyAnswerOption) {
          thisResponse.data = badRequest(new InvalidParamError('answer'))
          thisResponse.filled = true
        }
      }

      if (!thisResponse.filled) {
        const surveyAnswer = await this.surveyAnswerSaver.save({
          surveyId,
          accountId,
          answer
        })
        thisResponse.data = ok(surveyAnswer)
        thisResponse.filled = true
      }
    } catch (error) {
      thisResponse.data = serverError(error)
      thisResponse.filled = true
    }
    return thisResponse.data
  }
}
