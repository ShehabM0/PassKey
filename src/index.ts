import 'dotenv/config'
import express from 'express';

const app = express();
const port = process.env.PORT;

app.get('/', (req, res) => {
  res.send('Expressing node!');
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
