import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { SurveyModel } from '@/domain/models/survey'
import { DbLoadSurveyById } from './db-load-survey-by-id'

describe('DbLoadPolls Usecase', () => {
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

  const makeLoadSurveyByIdRepositoryStub = (): LoadSurveyByIdRepository => {
    class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
      async loadById (): Promise<SurveyModel> {
        return await Promise.resolve(makeFakePolls()[0])
      }
    }
    return new LoadSurveyByIdRepositoryStub()
  }

  type SutTypes = {
    sut: DbLoadSurveyById
    loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
  }

  const makeSut = (): SutTypes => {
    const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepositoryStub()
    const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub)
    return {
      sut,
      loadSurveyByIdRepositoryStub
    }
  }

  test('Should call LoadPollsRepository', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    await sut.loadById(makeFakePolls()[0].id)
    expect(loadSpy).toHaveBeenCalled()
  })
})
