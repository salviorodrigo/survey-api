import { DbLoadPolls } from './db-load-polls'
import {
  SurveyModel,
  LoadPollsRepository
} from './db-load-polls-protocols'
import MockDate from 'mockdate'

describe('DbLoadPolls Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  const makeFakePolls = (): SurveyModel[] => {
    return [{
      id: 'any_id',
      question: 'any_question',
      date: new Date()
    }, {
      id: 'another_id',
      question: 'another_question',
      date: new Date()
    }]
  }

  const makeLoadPollsRepositoryStub = (): LoadPollsRepository => {
    class LoadPollsRepositoryStub implements LoadPollsRepository {
      async loadAll (): Promise<SurveyModel[]> {
        return await Promise.resolve(makeFakePolls())
      }
    }
    return new LoadPollsRepositoryStub()
  }

  type SutTypes = {
    sut: DbLoadPolls
    loadPollsRepositoryStub: LoadPollsRepository
  }

  const makeSut = (): SutTypes => {
    const loadPollsRepositoryStub = makeLoadPollsRepositoryStub()
    const sut = new DbLoadPolls(loadPollsRepositoryStub)
    return {
      sut,
      loadPollsRepositoryStub
    }
  }

  test('Should call LoadPollsRepository', async () => {
    const { sut, loadPollsRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadPollsRepositoryStub, 'loadAll')
    await sut.load()
    expect(loadSpy).toHaveBeenCalled()
  })

  test('Should return a list of polls on success', async () => {
    const { sut } = makeSut()
    const thisResponse = await sut.load()
    expect(thisResponse).toEqual(makeFakePolls())
  })

  test('Should throw if LoadPollsRepository throws', async () => {
    const { sut, loadPollsRepositoryStub } = makeSut()
    jest.spyOn(loadPollsRepositoryStub, 'loadAll').mockImplementationOnce(() => {
      throw new Error()
    })
    const thisResponse = sut.load()
    await expect(thisResponse).rejects.toThrow()
  })
})
