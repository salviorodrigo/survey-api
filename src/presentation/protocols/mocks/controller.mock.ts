import { HttpRequest, HttpResponse } from '../http'
import { noContent } from '@/presentation/helpers/http/http-helper'
import { Controller } from '../controllers'

export const mockController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return noContent()
    }
  }
  return new ControllerStub()
}
