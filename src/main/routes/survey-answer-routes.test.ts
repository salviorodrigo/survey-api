import app from '@/main/config/app'
import request from 'supertest'

const fakeSurveyAnswerData = {
  answer: 'any_answer'
}

describe('Survey Routes', () => {
  describe('PUT /survey/:surveyId/answers', () => {
    test('Should return 403 on add survey without accessToken', async () => {
      await request(app)
        .put('/api/surveys/any_id/answers')
        .send(fakeSurveyAnswerData)
        .expect(403)
    })
  })
})
