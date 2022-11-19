import {
  SaveSurveyAnswerRepository,
  SurveyAnswerModel,
  SaveSurveyAnswer,
  SaveSurveyAnswerModel
} from './db-save-survey-answer-protocols'

export class DbSaveSurveyAnswer implements SaveSurveyAnswer {
  constructor (private readonly saveSurveyAnswerRepository: SaveSurveyAnswerRepository) {}

  async save (surveyAnswerData: SaveSurveyAnswerModel): Promise<SurveyAnswerModel | null> {
    const thisResponse = {
      filled: false,
      data: null
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
