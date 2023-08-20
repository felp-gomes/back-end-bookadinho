import express from 'express';
import routes from './routers/routes.js';
import 'dotenv/config.js';

const app = express();
app.use(express.json());

routes(app);

export default app;
