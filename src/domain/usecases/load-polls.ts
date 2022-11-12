import { SurveyModel } from '../models/survey'

export interface LoadPolls {
  load (): Promise<SurveyModel[]>
}
