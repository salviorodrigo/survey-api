import {
  LoadPolls,
  SurveyModel,
  LoadPollsRepository
} from './db-load-polls-protocols'

export class DbLoadPolls implements LoadPolls {
  constructor (private readonly loadPollsRepository: LoadPollsRepository) {}

  async load (): Promise<SurveyModel[]> {
    const pollsList = await this.loadPollsRepository.loadAll()
    return pollsList
  }
}
