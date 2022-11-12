import { SurveyModel } from '../../../domain/models/survey'
import { LoadPollsRepository } from '../../protocols/db/survey/load-polls-repository'
import { DbLoadPolls } from './db-load-polls'

describe('DbLoadPolls Usecase', () => {
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

  interface SutTypes {
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
})
