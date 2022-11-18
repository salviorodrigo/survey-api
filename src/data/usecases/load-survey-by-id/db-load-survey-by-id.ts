import { SurveyModel } from '@/domain/models/survey'
import { LoadSurveyById } from '@/domain/usecases/load-survey-by-id'
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'

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
