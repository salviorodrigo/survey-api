import { LoadPollsController } from './load-polls-controller'
import {
  SurveyModel,
  LoadPolls,
  SurveyAnswerOptionModel
} from './load-polls-controller-protocols'
import { noContent, ok, serverError } from '@/presentation/helpers/http/http-helper'
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

const makeLoadPollsStub = (): LoadPolls => {
  class LoadPollsStub implements LoadPolls {
    async load (): Promise<SurveyModel[]> {
      return await Promise.resolve(makeFakePolls())
    }
  }
  return new LoadPollsStub()
}

type SutTypes = {
  sut: LoadPollsController
  loadPollsStub: LoadPolls
}

const makeSut = (): SutTypes => {
  const loadPollsStub = makeLoadPollsStub()
  const sut = new LoadPollsController(loadPollsStub)
  return {
    sut,
    loadPollsStub
  }
}

describe('LoadPolls Controller', () => {
  test('Should call LoadPolls', async () => {
    const { sut, loadPollsStub } = makeSut()
    const loadSpy = jest.spyOn(loadPollsStub, 'load')
    await sut.handle({})
    expect(loadSpy).toHaveBeenCalled()
  })

  test('Should returns 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(ok(makeFakePolls()))
  })

  test('Should returns 204 if LoadPolls returns empty', async () => {
    const { sut, loadPollsStub } = makeSut()
    jest.spyOn(loadPollsStub, 'load').mockResolvedValueOnce([])
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(noContent())
  })

  test('Should return 500 if LoadPolls throws', async () => {
    const { sut, loadPollsStub } = makeSut()
    jest.spyOn(loadPollsStub, 'load').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
