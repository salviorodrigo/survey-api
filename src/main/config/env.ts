export default {
  mongoUrl: process.env.MONGO_URL as string ?? 'mongodb://localhost:27017/survey-api',
  port: process.env.PORT ?? 5050,
  saltFromHasher: process.env.SALT_FROM_HASHER as unknown as number ?? 12,
  jwtSecret: process.env.JWT_SECRET ?? 'secret'
}
