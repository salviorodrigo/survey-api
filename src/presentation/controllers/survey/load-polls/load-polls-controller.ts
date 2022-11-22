import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadPolls
} from './load-polls-controller-protocols'
import { noContent, ok, serverError } from '@/presentation/helpers/http/http-helper'

export class LoadPollsController implements Controller {
  constructor (private readonly loadPolls: LoadPolls) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const thisReponse = {
      filled: false,
      data: null
    }

    try {
      if (!thisReponse.filled) {
        const polls = await this.loadPolls.load()
        if (polls.length) {
          thisReponse.data = ok(polls)
          thisReponse.filled = true
        } else {
          thisReponse.data = noContent()
          thisReponse.filled = true
        }
      }
    } catch (error) {
      thisReponse.data = serverError(error)
      thisReponse.filled = true
    }

    return thisReponse.data
  }
}
