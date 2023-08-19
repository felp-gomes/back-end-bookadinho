import { json } from 'express';
import bookRoutes from './bookRoutes';
import profileRoutes from './profileRoutes';
const routes = (app) => {
    app.route('/').get((req, res) => {
        res.status(200).send({ titulo: 'Hello World Bookadinho' });
    });
    app.use(json(), bookRoutes, profileRoutes);
};
export default routes;
//# sourceMappingURL=routes.js.map