import { EmailValidator } from './email-validator'
import { InvalidParamError } from '@/presentation/errors'
import { EmailValidator as EmailValidatorInterface } from '@/presentation/protocols'

const makeEmailValidator = (): EmailValidatorInterface => {
  class EmailValidatorAdapterStub implements EmailValidatorInterface {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorAdapterStub()
}

interface SutTypes {
  sut: EmailValidator
  emailValidatorAdapterStub: EmailValidatorInterface
}

const makeSut = (): SutTypes => {
  const emailValidatorAdapterStub = makeEmailValidator()
  const sut = new EmailValidator('email', emailValidatorAdapterStub)

  return {
    sut,
    emailValidatorAdapterStub
  }
}

describe('Email Validator', () => {
  test('Should return an error if an invalid email is provided', () => {
    const { sut, emailValidatorAdapterStub } = makeSut()
    jest.spyOn(emailValidatorAdapterStub, 'isValid').mockReturnValueOnce(false)
    const thisResponse = sut.validate('invalid_email')
    expect(thisResponse).toEqual(new InvalidParamError('email'))
  })

  test('Should call EmailValidatorAdapter with provided email', () => {
    const { sut, emailValidatorAdapterStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorAdapterStub, 'isValid')
    sut.validate({
      email: 'any_email@mail.com'
    })
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should throw if EmailValidator throws', () => {
    const { sut, emailValidatorAdapterStub } = makeSut()
    jest.spyOn(emailValidatorAdapterStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    expect(sut.validate).toThrow()
  })

  test('Should not returns if validation succeeds', () => {
    const { sut } = makeSut()
    expect(sut.validate({ email: 'any_mail@mail.com' })).toEqual(null)
  })
})
