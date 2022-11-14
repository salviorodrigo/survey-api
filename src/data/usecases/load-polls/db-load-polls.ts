import { LoadPolls } from '@/domain/usecases/load-polls'
import { SurveyModel } from '@/domain/models/survey'
import { LoadPollsRepository } from '@/data/protocols/db/survey/load-polls-repository'

export class DbLoadPolls implements LoadPolls {
  constructor (private readonly loadPollsRepository: LoadPollsRepository) {}

  async load (): Promise<SurveyModel[]> {
    const pollsList = await this.loadPollsRepository.loadAll()
    return pollsList
  }
}
