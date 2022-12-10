import { LoadSurveyAnswer } from '@/domain/usecases/survey-answer/load-survey-answer'
import { SurveyAnswerModel } from '@/domain/models'
import { LoadSurveyAnswerRepository } from '@/data/protocols/db/survey-answer'

export class DbLoadSurveyAnswer implements LoadSurveyAnswer {
  constructor (
    private readonly surveyAnswerLoader: LoadSurveyAnswerRepository
  ) {}

  async loadAnswersBySurveyId (surveyId: string): Promise<SurveyAnswerModel[]> {
    return await Promise.resolve(
      this.surveyAnswerLoader.loadAnswersBySurveyId(surveyId)
    )
  }
}
