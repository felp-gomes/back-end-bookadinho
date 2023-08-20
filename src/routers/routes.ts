import { json, Express, Request, Response } from 'express';
import bookRoutes from './bookRoutes.js';
import profileRoutes from './profileRoutes.js';

const routes = (app: Express) => {
  app.route('/').get((req: Request, res: Response) => {
    res.status(200).send({ titulo: 'Hello World Bookadinho' });
  });

  app.use(json(), bookRoutes, profileRoutes);
};

export default routes;
