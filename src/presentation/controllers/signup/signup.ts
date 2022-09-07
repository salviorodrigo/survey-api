import { badRequest, serverError } from './../helpers/http-helper'
import { HttpRequest, HttpResponse, Controller, EmailValidator, AddAccount } from './signup-protocols'
import { MissingParamError, InvalidParamError } from '../../errors'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    const thisResponse = {
      filled: false,
      data: {
        statusCode: 200,
        body: {}
      }
    }

    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      if (!thisResponse.filled) {
        for (const field of requiredFields) {
          if (!httpRequest.body[field]) {
            thisResponse.data = badRequest(new MissingParamError(field))
            thisResponse.filled = true
            break
          }
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body

      if (!thisResponse.filled) {
        const passwordConfirmationMatch = (password === passwordConfirmation)
        if (!passwordConfirmationMatch) {
          thisResponse.data = badRequest(new InvalidParamError('passwordConfirmation'))
          thisResponse.filled = true
        }
      }

      if (!thisResponse.filled) {
        const isAnValidEmail = this.emailValidator.isValid(email)
        if (!isAnValidEmail) {
          thisResponse.data = badRequest(new InvalidParamError('email'))
          thisResponse.filled = true
        }
      }

      if (!thisResponse.filled) {
        this.addAccount.add({
          name,
          email,
          password
        })
      }
    } catch (error) {
      thisResponse.filled = true
      thisResponse.data = serverError()
    }

    return thisResponse.data
  }
}