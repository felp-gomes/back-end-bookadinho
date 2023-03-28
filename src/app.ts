import express from 'express';

const app = express();
app.use(express.json());

app.get('/', (req: express.Request, res: express.Response) => {
  res.status(200).send('Hello World Bookadinho');
});

export default app;
