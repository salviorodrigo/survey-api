import { LoadPolls } from '../../../domain/usecases/load-polls'
import { SurveyModel } from '../../../domain/models/survey'
import { LoadPollsRepository } from '../../protocols/db/survey/load-polls-repository'

export class DbLoadPolls implements LoadPolls {
  constructor (private readonly loadPollsRepository: LoadPollsRepository) {}

  async load (): Promise<SurveyModel[]> {
    await this.loadPollsRepository.loadAll()
    return await Promise.resolve(null)
  }
}
