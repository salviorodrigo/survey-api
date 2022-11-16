import { DbLoadPolls } from './db-load-polls'
import { SurveyModel } from '@/domain/models/survey'
import { LoadPollsRepository } from '@/data/protocols/db/survey/load-polls-repository'
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
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }, {
        answer: 'any_anwer 2'
      }],
      date: new Date()
    }, {
      id: 'another_id',
      question: 'another_question',
      answers: [{
        answer: 'another_answer'
      }],
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
    loadPollsRepositoyStub: LoadPollsRepository
  }

  const makeSut = (): SutTypes => {
    const loadPollsRepositoyStub = makeLoadPollsRepositoryStub()
    const sut = new DbLoadPolls(loadPollsRepositoyStub)
    return {
      sut,
      loadPollsRepositoyStub
    }
  }

  test('Should call LoadPollsRepository', async () => {
    const { sut, loadPollsRepositoyStub } = makeSut()
    const loadSpy = jest.spyOn(loadPollsRepositoyStub, 'loadAll')
    await sut.load()
    expect(loadSpy).toHaveBeenCalled()
  })

  test('Should return a list of polls on success', async () => {
    const { sut } = makeSut()
    const thisResponse = await sut.load()
    expect(thisResponse).toEqual(makeFakePolls())
  })

  test('Should throw if LoadPollsRepository throws', async () => {
    const { sut, loadPollsRepositoyStub } = makeSut()
    jest.spyOn(loadPollsRepositoyStub, 'loadAll').mockImplementationOnce(() => {
      throw new Error()
    })
    const thisResponse = sut.load()
    await expect(thisResponse).rejects.toThrow()
  })
})
