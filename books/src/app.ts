import express from 'express';
import cors from 'cors';
import 'dotenv/config.js';

import routes from './infra/routes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use(routes);

export default app;
