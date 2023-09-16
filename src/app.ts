import express from 'express';
import routes from './routers/routes.js';
import cors from 'cors';
import 'dotenv/config.js';

const app = express();
app.use(cors());
app.use(express.json());

routes(app);

export default app;
