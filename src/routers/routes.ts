import express, { Express } from 'express';
import bookRoutes from './bookRoutes';
import profileRoutes from './profileRoutes'

const routes = (app: Express) => {
  app.route('/').get((req: express.Request, res: express.Response) => {
    res.status(200).send({ titulo: 'Hello World Bookadinho' });
  });

  app.use(express.json(), bookRoutes, profileRoutes);
};

export default routes;
