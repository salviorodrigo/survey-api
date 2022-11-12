import { Controller, HttpRequest, HttpResponse, LoadPolls } from './load-polls-protocols'
import { ok } from '../../../helpers/http/http-helper'

export class LoadPollsController implements Controller {
  constructor (private readonly loadPolls: LoadPolls) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const thisReponse = {
      filled: false,
      data: null
    }
    if (!thisReponse.filled) {
      const polls = await this.loadPolls.load()
      if (polls) {
        thisReponse.data = ok(polls)
        thisReponse.filled = true
      }
    }
    return thisReponse.data
  }
}
