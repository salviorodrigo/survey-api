import {
  SurveyModel,
  LoadSurveyById,
  LoadSurveyByIdRepository
} from './db-load-survey-by-id-protocols'

export class DbLoadSurveyById implements LoadSurveyById {
  constructor (private readonly loadPollsRepository: LoadSurveyByIdRepository) {}

  async loadById (id: string): Promise<SurveyModel> {
    const thisResponse = {
      filled: false,
      data: null
    }

    if (!thisResponse.filled) {
      const survey = await this.loadPollsRepository.loadById(id)
      if (survey) {
        thisResponse.data = survey
        thisResponse.filled = true
      }
    }

    return thisResponse.data
  }
}
