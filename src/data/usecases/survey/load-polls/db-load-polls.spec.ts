import { DbLoadPolls } from './db-load-polls'
import { LoadPollsRepository } from './db-load-polls-protocols'
import { mockSurveyModel } from '@/domain/models/mocks'
import { mockLoadPollsRepository } from '@/data/protocols/db/survey/mocks'
import MockDate from 'mockdate'

beforeAll(() => {
  MockDate.set(new Date())
})

afterAll(() => {
  MockDate.reset()
})

type SutTypes = {
  sut: DbLoadPolls
  loadPollsRepositoryStub: LoadPollsRepository
}

const makeSut = (): SutTypes => {
  const loadPollsRepositoryStub = mockLoadPollsRepository()
  const sut = new DbLoadPolls(loadPollsRepositoryStub)
  return {
    sut,
    loadPollsRepositoryStub
  }
}

describe('DbLoadPolls Usecase', () => {
  test('Should call LoadPollsRepository', async () => {
    const { sut, loadPollsRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadPollsRepositoryStub, 'loadAll')
    await sut.load()
    expect(loadSpy).toHaveBeenCalled()
  })

  test('Should return a list of polls on success', async () => {
    const { sut } = makeSut()
    const thisResponse = await sut.load()
    expect(thisResponse).toEqual([mockSurveyModel(), mockSurveyModel()])
  })

  test('Should throw if LoadPollsRepository throws', async () => {
    const { sut, loadPollsRepositoryStub } = makeSut()
    jest.spyOn(loadPollsRepositoryStub, 'loadAll').mockRejectedValueOnce(new Error())
    const thisResponse = sut.load()
    await expect(thisResponse).rejects.toThrow()
  })
})
