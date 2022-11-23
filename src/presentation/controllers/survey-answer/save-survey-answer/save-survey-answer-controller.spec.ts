import { SaveSurveyAnswerController } from './save-survey-answer-controller'
import {
  LoadSurveyById,
  HttpRequest,
  SurveyAnswerOptionModel,
  SurveyModel
} from './save-survey-answer-controller-protocols'
import MockDate from 'mockdate'

beforeAll(() => {
  MockDate.set(new Date())
})

afterAll(() => {
  MockDate.reset()
})

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'valid_surveyId',
    accountId: 'account',
    answer: 'any_answer'
  }
})
const makeFakeSurveyAnswerOptions = (): SurveyAnswerOptionModel[] => {
  return [{
    answer: 'any_answer',
    imagePath: 'https://image.path/locale.jpg'
  }, {
    answer: 'another_answer'
  }]
}

const makeFakeSurvey = (): SurveyModel => ({
  id: 'valid_id',
  question: 'any_question',
  answerOptions: makeFakeSurveyAnswerOptions(),
  date: new Date()
})

const makeLoadSurveyByIdStub = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel | null> {
      return await Promise.resolve(makeFakeSurvey())
    }
  }
  return new LoadSurveyByIdStub()
}

type SutTypes = {
  sut: SaveSurveyAnswerController
  surveyLoaderByIdStub: LoadSurveyById
}

const makeSut = (): SutTypes => {
  const surveyLoaderByIdStub = makeLoadSurveyByIdStub()
  const sut = new SaveSurveyAnswerController(surveyLoaderByIdStub)
  return {
    sut,
    surveyLoaderByIdStub
  }
}

describe('SaveSurveyAnswer Controller', () => {
  test('Should call validator with correct values', async () => {
    const { sut, surveyLoaderByIdStub } = makeSut()
    const loadSpy = jest.spyOn(surveyLoaderByIdStub, 'loadById')
    const fakeRequest = makeFakeRequest()
    await sut.handle(fakeRequest)
    expect(loadSpy).toHaveBeenCalledWith(fakeRequest.params.surveyId)
  })
})
