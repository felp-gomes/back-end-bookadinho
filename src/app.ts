import express from 'express';
import routes from './routers/routes';
import 'dotenv/config';

const app = express();
app.use(express.json());

routes(app);

export default app;
