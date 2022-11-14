import { SurveyModel } from '@/domain/models/survey'

export interface LoadPollsRepository {
  loadAll (): Promise<SurveyModel[]>
}
