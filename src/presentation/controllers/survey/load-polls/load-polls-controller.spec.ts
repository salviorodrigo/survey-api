import { SurveyModel, LoadPolls } from './load-polls-protocols'
import { LoadPollsController } from './load-polls-controller'
import MockDate from 'mockdate'

describe('LoadPolls Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  const makefakePolls = (): SurveyModel[] => {
    return [{
      id: 'any_id',
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }, {
        answer: 'any_anwer 2'
      }],
      date: new Date()
    }, {
      id: 'another_id',
      question: 'another_question',
      answers: [{
        answer: 'another_answer'
      }],
      date: new Date()
    }]
  }

  const makeLoadPollsStub = (): LoadPolls => {
    class LoadPollsStub implements LoadPolls {
      async load (): Promise<SurveyModel[]> {
        return await Promise.resolve(makefakePolls())
      }
    }
    return new LoadPollsStub()
  }

  interface SutTypes {
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

  test('Should call LoadPols', async () => {
    const { sut, loadPollsStub } = makeSut()
    const loadSpy = jest.spyOn(loadPollsStub, 'load')
    await sut.handle({})
    expect(loadSpy).toHaveBeenCalled()
  })
})
