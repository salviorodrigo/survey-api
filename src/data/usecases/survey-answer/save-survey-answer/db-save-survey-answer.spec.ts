import { DbSaveSurveyAnswer } from './db-save-survey-answer'
import {
  SaveSurveyAnswerRepository,
  SurveyAnswerModel,
  SaveSurveyAnswerModel
} from './db-save-survey-answer-protocols'
import MockDate from 'mockdate'

beforeAll(() => {
  MockDate.set(new Date())
})

afterAll(() => {
  MockDate.reset()
})

const makeFakeAddSurveyAnswerData = (): SaveSurveyAnswerModel => ({
  surveyId: 'valid_surveyId',
  accountId: 'account',
  answer: 'any_answer'
})

const makeFakeSurveyAnswerData = (): SurveyAnswerModel => (
  Object.assign({}, makeFakeAddSurveyAnswerData(), { id: 'valid_id', date: new Date() })
)

const makeSaveSurveyAnswerRepositoryStub = (): SaveSurveyAnswerRepository => {
  class SaveSurveyAnswerRepositoryStub implements SaveSurveyAnswerRepository {
    async save (surveyAnswerData: SaveSurveyAnswerModel): Promise<SurveyAnswerModel> {
      return await Promise.resolve(makeFakeSurveyAnswerData())
    }
  }
  return new SaveSurveyAnswerRepositoryStub()
}

type SutTypes = {
  sut: DbSaveSurveyAnswer
  saveSurveyAnswerRepositoryStub: SaveSurveyAnswerRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyAnswerRepositoryStub = makeSaveSurveyAnswerRepositoryStub()
  const sut = new DbSaveSurveyAnswer(saveSurveyAnswerRepositoryStub)

  return {
    sut,
    saveSurveyAnswerRepositoryStub
  }
}

describe('DbSaveSurveyAnswer Usecase', () => {
  test('Should calls SaveSurveyAnswerRepository with correct value', async () => {
    const { sut, saveSurveyAnswerRepositoryStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyAnswerRepositoryStub, 'save')
    const fakeAddSurveyAnswerData = makeFakeAddSurveyAnswerData()
    await sut.save(fakeAddSurveyAnswerData)
    expect(saveSpy).toHaveBeenCalledWith(fakeAddSurveyAnswerData)
  })

  test('Should return SurveyAnswerModel on success', async () => {
    const { sut } = makeSut()
    const fakeAddSurveyAnswerData = makeFakeAddSurveyAnswerData()
    const thisResponse = await sut.save(fakeAddSurveyAnswerData)
    expect(thisResponse).toEqual(makeFakeSurveyAnswerData())
  })

  test('Should return null if SaveSurveyAnswerRepository returns null', async () => {
    const { sut, saveSurveyAnswerRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyAnswerRepositoryStub, 'save').mockResolvedValueOnce(null)
    const fakeAddSurveyAnswerData = makeFakeAddSurveyAnswerData()
    const thisResponse = await sut.save(fakeAddSurveyAnswerData)
    expect(thisResponse).toBeNull()
  })

  test('Should throw if SaveSurveyAnswerRepository throws', async () => {
    const { sut, saveSurveyAnswerRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyAnswerRepositoryStub, 'save').mockImplementationOnce(() => {
      throw new Error()
    })
    const fakeAddSurveyAnswerData = makeFakeAddSurveyAnswerData()
    const thisResponse = sut.save(fakeAddSurveyAnswerData)
    await expect(thisResponse).rejects.toThrow()
  })
})
