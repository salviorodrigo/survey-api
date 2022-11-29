import { DbSaveSurveyAnswer } from './db-save-survey-answer'
import { SaveSurveyAnswerRepository } from './db-save-survey-answer-protocols'
import { mockSaveSurveyAnswerParams } from '@/domain/usecases/survey-answer'
import { mockSaveSurveyAnswerRepository } from '@/data/protocols/db/survey-answer'
import MockDate from 'mockdate'
import { mockSurveyAnswerModel } from '@/domain/models'

beforeAll(() => {
  MockDate.set(new Date())
})

afterAll(() => {
  MockDate.reset()
})

type SutTypes = {
  sut: DbSaveSurveyAnswer
  saveSurveyAnswerRepositoryStub: SaveSurveyAnswerRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyAnswerRepositoryStub = mockSaveSurveyAnswerRepository()
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
    const fakeSaveSurveyAnswerData = mockSaveSurveyAnswerParams()
    await sut.save(fakeSaveSurveyAnswerData)
    expect(saveSpy).toHaveBeenCalledWith(fakeSaveSurveyAnswerData)
  })

  test('Should return SurveyAnswerModel on success', async () => {
    const { sut } = makeSut()
    const fakeAddSurveyAnswerData = mockSaveSurveyAnswerParams()
    const thisResponse = await sut.save(fakeAddSurveyAnswerData)
    expect(thisResponse).toEqual(mockSurveyAnswerModel())
  })

  test('Should return null if SaveSurveyAnswerRepository returns null', async () => {
    const { sut, saveSurveyAnswerRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyAnswerRepositoryStub, 'save').mockResolvedValueOnce(null)
    const fakeAddSurveyAnswerData = mockSaveSurveyAnswerParams()
    const thisResponse = await sut.save(fakeAddSurveyAnswerData)
    expect(thisResponse).toBeNull()
  })

  test('Should throw if SaveSurveyAnswerRepository throws', async () => {
    const { sut, saveSurveyAnswerRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyAnswerRepositoryStub, 'save').mockRejectedValueOnce(new Error())
    const fakeAddSurveyAnswerData = mockSaveSurveyAnswerParams()
    const thisResponse = sut.save(fakeAddSurveyAnswerData)
    await expect(thisResponse).rejects.toThrow()
  })
})
