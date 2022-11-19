import { DbSaveSurveyAnswer } from './db-save-survey-answer'
import { SaveSurveyAnswerRepository } from '@/data/protocols/db/survey-answer/save-survey-answer-repository'
import { SurveyAnswerModel } from '@/domain/models/survey-answer'
import { SaveSurveyAnswerModel } from '@/domain/usecases/save-survey-answer'
import MockDate from 'mockdate'

beforeAll(() => {
  MockDate.set(new Date())
})

afterAll(() => {
  MockDate.reset()
})

const makeFakeAddSurveyAnswerData = (): SaveSurveyAnswerModel => ({
  survey_id: 'valid_survey_id',
  account_id: 'account',
  answer: 'any_answer',
  date: new Date()
})

const makeFakeSurveyAnswerData = (): SurveyAnswerModel => (
  Object.assign({}, makeFakeAddSurveyAnswerData(), { id: 'valid_id' })
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
