import { errorFormat } from '../utils/error-format.ts'
import { logger } from '../config/logger.ts'
import z from 'zod'

const envSchema = z.object({
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string().url(),
  ARCJET_KEY: z.string(),
  ARCJET_ENV: z.enum(['development', 'production']).default('development'),
  ACCESS_TOKEN: z.string(),
  REFRESH_TOKEN: z.string(),
  ENC_SECRET: z.string(),
  EMAIL_HOST: z.string(),
  EMAIL_PORT: z.string(),
  EMAIL_USER: z.string(),
  EMAIL_PASSWORD: z.string(),
})

const validateEnv = () => {
    const validation = envSchema.safeParse(process.env);
    if(!validation.success) {
      logger.error("Env variables error")
      logger.error(errorFormat(validation.error.issues))
      process.exit(1);
    }
}

export { validateEnv }