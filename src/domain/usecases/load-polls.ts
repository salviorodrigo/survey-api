import { SurveyModel } from '@/domain/models/survey'

export interface LoadPolls {
  load (): Promise<SurveyModel[]>
}
