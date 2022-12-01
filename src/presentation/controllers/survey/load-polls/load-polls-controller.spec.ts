import { LoadPollsController } from './load-polls-controller'
import { LoadPolls } from './load-polls-controller-protocols'
import { mockLoadPolls } from '@/domain/usecases/survey/mocks'
import { mockSurveyModel } from '@/domain/models/mocks'
import { noContent, ok, serverError } from '@/presentation/helpers/http/http-helper'
import MockDate from 'mockdate'

beforeAll(() => {
  MockDate.set(new Date())
})

afterAll(() => {
  MockDate.reset()
})

type SutTypes = {
  sut: LoadPollsController
  pollsLoaderStub: LoadPolls
}

const makeSut = (): SutTypes => {
  const loadPollsStub = mockLoadPolls()
  const sut = new LoadPollsController(loadPollsStub)
  return {
    sut,
    pollsLoaderStub: loadPollsStub
  }
}

describe('LoadPolls Controller', () => {
  test('Should call LoadPolls', async () => {
    const { sut, pollsLoaderStub: loadPollsStub } = makeSut()
    const loadSpy = jest.spyOn(loadPollsStub, 'load')
    await sut.handle({})
    expect(loadSpy).toHaveBeenCalled()
  })

  test('Should returns 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(ok([mockSurveyModel(), mockSurveyModel()]))
  })

  test('Should returns 204 if LoadPolls returns empty', async () => {
    const { sut, pollsLoaderStub: loadPollsStub } = makeSut()
    jest.spyOn(loadPollsStub, 'load').mockResolvedValueOnce([])
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(noContent())
  })

  test('Should return 500 if LoadPolls throws', async () => {
    const { sut, pollsLoaderStub: loadPollsStub } = makeSut()
    jest.spyOn(loadPollsStub, 'load').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
