import {
  SaveSurveyAnswerRepository,
  SurveyAnswerModel,
  SaveSurveyAnswer,
  SaveSurveyAnswerParams
} from './db-save-survey-answer-protocols'

export class DbSaveSurveyAnswer implements SaveSurveyAnswer {
  constructor (private readonly saveSurveyAnswerRepository: SaveSurveyAnswerRepository) {}

  async save (surveyAnswerData: SaveSurveyAnswerParams): Promise<SurveyAnswerModel | null> {
    const thisResponse = {
      filled: false,
      data: null as unknown as SurveyAnswerModel
    }
    if (!thisResponse.filled) {
      const surveyAnswer = await this.saveSurveyAnswerRepository.save(surveyAnswerData)
      if (surveyAnswer) {
        thisResponse.data = surveyAnswer
        thisResponse.filled = true
      }
    }
    return thisResponse.data
  }
}
