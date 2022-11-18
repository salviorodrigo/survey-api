import { DbAddSurvey } from './db-add-survey'
import { AddSurveyModel, AddSurveyRepository } from './db-add-survey-protocols'
import MockDate from 'mockdate'

describe('DbAddSurvey Usecase', () => {
  const makeFakeSurveyData = (): AddSurveyModel => ({
    question: 'any_question',
    date: new Date()
  })

  const makeAddSurveyRepositoryStub = (): AddSurveyRepository => {
    class AddSurveyRepositoryStub implements AddSurveyRepository {
      async add (surveyData: AddSurveyModel): Promise<void> {}
    }
    return new AddSurveyRepositoryStub()
  }

  type SutTypes = {
    sut: DbAddSurvey
    addSurveyRepositoryStub: AddSurveyRepository
  }

  const makeSut = (): SutTypes => {
    const addSurveyRepositoryStub = makeAddSurveyRepositoryStub()
    const sut = new DbAddSurvey(addSurveyRepositoryStub)
    return {
      sut,
      addSurveyRepositoryStub
    }
  }

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    const fakeSurveyData = makeFakeSurveyData()
    await sut.add(fakeSurveyData)
    expect(addSpy).toHaveBeenCalledWith(fakeSurveyData)
  })

  test('Should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    jest.spyOn(addSurveyRepositoryStub, 'add').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.add(makeFakeSurveyData())
    await expect(promise).rejects.toThrow()
  })
})
