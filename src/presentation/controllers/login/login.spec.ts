import { badRequest } from './../../helpers/http-helper'
import { HttpRequest } from '../../protocols'
import { LoginController } from './login'
import { MissingParamError } from '../../errors'

describe('Login Controller', () => {
  test('Should return 400 if no email es provided', async () => {
    const sut = new LoginController()

    const httpRequest: HttpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return 400 if no password es provided', async () => {
    const sut = new LoginController()

    const httpRequest: HttpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })
})
