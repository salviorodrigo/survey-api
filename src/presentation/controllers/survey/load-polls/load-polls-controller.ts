import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadPolls
} from './load-polls-controller-protocols'
import { noContent, ok, serverError } from '@/presentation/helpers/http/http-helper'

export class LoadPollsController implements Controller {
  constructor (private readonly pollsLoader: LoadPolls) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const thisResponse = {
      filled: false,
      data: null
    }

    try {
      if (!thisResponse.filled) {
        const polls = await this.pollsLoader.load()
        if (polls.length) {
          thisResponse.data = ok(polls)
          thisResponse.filled = true
        } else {
          thisResponse.data = noContent()
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
