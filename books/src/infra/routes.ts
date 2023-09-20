import { Router, Request, Response } from 'express';

const routes = Router();

routes.get('/books', (req: Request, res: Response) => {
  return res.send('Hello World BOOKS');
});

export default routes;
