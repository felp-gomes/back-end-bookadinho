import express from 'express';
import routes from './routers/routes';

const app = express();
app.use(express.json());

routes(app);

export default app;
