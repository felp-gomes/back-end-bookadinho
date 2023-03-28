import express, { Express } from 'express';
import bookRoutes from './bookRoutes';

const routes = (app: Express) => {
  app.route('/').get((req: express.Request, res: express.Response) => {
    res.status(200).send({ titulo: 'Hello World Bookadinho' });
  });

  app.use(express.json(), bookRoutes);
};

export default routes;
