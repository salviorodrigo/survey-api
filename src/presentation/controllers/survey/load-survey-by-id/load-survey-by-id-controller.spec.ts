import { LoadSurveyByIdController } from './load-survey-by-id-controller'
import {
  HttpRequest,
  LoadSurveyById,
  SurveyAnswerOptionModel,
  SurveyModel
} from './load-survey-by-id-controller-protocols'
import MockDate from 'mockdate'

beforeAll(() => {
  MockDate.set(new Date())
})

afterAll(() => {
  MockDate.reset()
})

const makeFakeRequest = (): HttpRequest => ({
  body: {
    surveyId: 'valid_id'
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
    async loadById (id: string): Promise<SurveyModel> {
      return await Promise.resolve(makeFakeSurvey())
    }
  }
  return new LoadSurveyByIdStub()
}

type SutTypes = {
  sut: LoadSurveyByIdController
  surveyLoaderStub: LoadSurveyById
}

const makeSut = (): SutTypes => {
  const surveyLoaderStub = makeLoadSurveyByIdStub()
  const sut = new LoadSurveyByIdController(surveyLoaderStub)
  return {
    sut,
    surveyLoaderStub
  }
}

describe('LoadSurveyById Controller', () => {
  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, surveyLoaderStub } = makeSut()
    const loadSpy = jest.spyOn(surveyLoaderStub, 'loadById')
    const fakeRequestData = makeFakeRequest()
    await sut.handle(fakeRequestData)

    expect(loadSpy).toHaveBeenCalledWith(fakeRequestData.body.surveyId)
  })

  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, surveyLoaderStub } = makeSut()
    const loadSpy = jest.spyOn(surveyLoaderStub, 'loadById')
    const fakeRequestData = makeFakeRequest()
    await sut.handle(fakeRequestData)

    expect(loadSpy).toHaveBeenCalledWith(fakeRequestData.body.surveyId)
  })
})
