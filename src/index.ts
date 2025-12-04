import 'dotenv/config'
import { ajMiddleware } from './middleware/arcjet.ts'
import { logger } from './config/logger.ts'
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

app.get('/', (req, res) => {
  logger.info('winston logging!')
  res.status(200).send('PassKey+ is healthy!');
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
