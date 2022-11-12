import { Controller, HttpRequest, HttpResponse, LoadPolls } from './load-polls-protocols'

export class LoadPollsController implements Controller {
  constructor (private readonly loadPolls: LoadPolls) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.loadPolls.load()
    return await Promise.resolve(null)
  }
}
