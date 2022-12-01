import { DbLoadSurveyById } from './db-load-survey-by-id'
import { LoadSurveyByIdRepository } from './db-load-survey-by-id-protocols'
import { mockSurveyModel } from '@/domain/models/mocks'
import { mockLoadSurveyByIdRepository } from '@/data/protocols/db/survey/mocks'
import MockDate from 'mockdate'

beforeAll(() => {
  MockDate.set(new Date())
})

afterAll(() => {
  MockDate.reset()
})

type SutTypes = {
  sut: DbLoadSurveyById
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub)
  return {
    sut,
    loadSurveyByIdRepositoryStub
  }
}

describe('DbLoadSurveyById Usecase', () => {
  test('Should call LoadPollsRepository with correct value', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    const fakeSurvey = mockSurveyModel()
    await sut.loadById(fakeSurvey.id)
    expect(loadSpy).toHaveBeenCalledWith(fakeSurvey.id)
  })

  test('Should return a survey on success', async () => {
    const { sut } = makeSut()
    const fakeSurvey = mockSurveyModel()
    const thisResponse = await sut.loadById(fakeSurvey.id)
    expect(thisResponse).toEqual(fakeSurvey)
  })

  test('Should return null if LoadSurveyById returns empty', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockResolvedValueOnce(null)
    const thisResponse = await sut.loadById('invalid_id')
    expect(thisResponse).toBeNull()
  })

  test('Should throw LoadPollsRepository throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockRejectedValueOnce(new Error())
    const thisResponse = sut.loadById(mockSurveyModel().id)
    await expect(thisResponse).rejects.toThrow()
  })
})
