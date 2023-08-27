import cluster from 'node:cluster';
import os from 'node:os';
import app from '../../app.js';

const cpus = os.cpus();
const port = 3000;

if (cluster.isPrimary) {
  cpus.forEach(() => cluster.fork());
  cluster.on('exit', (error) => console.debug(error));
} else {
  app.listen(port, () => {
    console.debug(`\x1b[32m[Servidor up http://localhost:${port}]\x1b[0m`);
  });
}
