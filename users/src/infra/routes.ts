import { Router, Request, Response } from 'express';

const routes = Router();

routes.get('/users', (req: Request, res: Response) => {
  return res.send('Hello World USERS');
});

export default routes;
