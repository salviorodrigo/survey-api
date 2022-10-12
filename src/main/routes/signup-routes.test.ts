import request from 'supertest'
import app from '../config/app'

describe('SignUp Routes', () => {
  test('Should return 200 on success', async () => {
    await request(app)
      .post('/api/signup')
      .expect(200)
  })
})
