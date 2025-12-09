import 'dotenv/config'
import { ajMiddleware } from './middleware/arcjet.ts'
import { validateEnv } from './validation/env.ts'
import { logger } from './config/logger.ts'
import usersRoutes from './routes/user.ts'
import authRoutes from './routes/auth.ts'
import cookieParser from 'cookie-parser'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'

const port = process.env.PORT;
const app = express();

app.use(cookieParser())
app.use(express.json())
app.use(ajMiddleware)
app.use(helmet())
app.use(cors())
validateEnv()

app.get('/', (req, res) => {
  res.status(200).send('PassKey+ is healthy!')
});

app.use('/api/users', usersRoutes)
app.use('/api/auth', authRoutes)

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`)
})
