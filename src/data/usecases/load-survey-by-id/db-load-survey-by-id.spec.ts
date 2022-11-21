import { DbLoadSurveyById } from './db-load-survey-by-id'
import {
  SurveyModel,
  LoadSurveyByIdRepository,
  SurveyAnswerOptionModel
} from './db-load-survey-by-id-protocols'
import MockDate from 'mockdate'

beforeAll(() => {
  MockDate.set(new Date())
})

afterAll(() => {
  MockDate.reset()
})

const makeFakeSurveyAnswerOptions = (): SurveyAnswerOptionModel[] => {
  return [{
    answer: 'any_answer',
    imagePath: 'https://image.path/locale.jpg'
  }, {
    answer: 'another_answer'
  }]
}

const makeFakePolls = (): SurveyModel[] => {
  return [{
    id: 'any_id',
    question: 'any_question',
    answerOptions: makeFakeSurveyAnswerOptions(),
    date: new Date()
  }, {
    id: 'another_id',
    question: 'another_question',
    answerOptions: makeFakeSurveyAnswerOptions(),
    date: new Date()
  }]
}

const makeLoadSurveyByIdRepositoryStub = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (id: string): Promise<SurveyModel> {
      const thisResponse = makeFakePolls().filter(item => item.id === id)
      return await Promise.resolve(thisResponse[0])
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

describe('DbLoadSurveyById Usecase', () => {
  test('Should call LoadPollsRepository with correct value', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    const fakeSurvey = makeFakePolls()[0]
    await sut.loadById(fakeSurvey.id)
    expect(loadSpy).toHaveBeenCalledWith(fakeSurvey.id)
  })

  test('Should return a survey on success', async () => {
    const { sut } = makeSut()
    const fakeSurvey = makeFakePolls()[0]
    const thisResponse = await sut.loadById(fakeSurvey.id)
    expect(thisResponse).toEqual(fakeSurvey)
  })

  test('Should return null if LoadSurveyById returns empty', async () => {
    const { sut } = makeSut()
    const thisResponse = await sut.loadById('invalid_id')
    expect(thisResponse).toBeNull()
  })

  test('Should throw LoadPollsRepository throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockImplementationOnce(() => {
      throw new Error()
    })
    const thisResponse = sut.loadById(makeFakePolls()[0].id)
    await expect(thisResponse).rejects.toThrow()
  })
})
