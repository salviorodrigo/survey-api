import { DbSaveSurveyAnswer } from './db-save-survey-answer'
import { SaveSurveyAnswerRepository } from '@/data/protocols/db/survey-answer/save-survey-answer-repository'
import { SurveyAnswerModel } from '@/domain/models/survey-answer'
import { SaveSurveyAnswerModel } from '@/domain/usecases/save-survey-answer'
import MockDate from 'mockdate'

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
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should calls SaveSurveyAnswerRepository with correct value', async () => {
    const { sut, saveSurveyAnswerRepositoryStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyAnswerRepositoryStub, 'save')
    const fakeAddSurveyAnswerData = makeFakeAddSurveyAnswerData()
    await sut.save(fakeAddSurveyAnswerData)
    expect(saveSpy).toHaveBeenCalledWith(fakeAddSurveyAnswerData)
  })
})
