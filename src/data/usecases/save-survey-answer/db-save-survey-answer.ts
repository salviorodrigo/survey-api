import { SaveSurveyAnswerRepository } from '@/data/protocols/db/survey-answer/save-survey-answer-repository'
import { SurveyAnswerModel } from '@/domain/models/survey-answer'
import { SaveSurveyAnswer, SaveSurveyAnswerModel } from '@/domain/usecases/save-survey-answer'

export class DbSaveSurveyAnswer implements SaveSurveyAnswer {
  constructor (private readonly saveSurveyAnswerRepository: SaveSurveyAnswerRepository) {}

  async save (surveyAnswerData: SaveSurveyAnswerModel): Promise<SurveyAnswerModel> {
    await this.saveSurveyAnswerRepository.save(surveyAnswerData)
    return null
  }
}
