import cluster from 'node:cluster';
import os from 'node:os';
import app from '../../app.js';

const cpus = os.cpus();
const port = 3000;

const onWorkerError = (code: unknown, signal: unknown) => {
  console.log(code, signal);
};

if (cluster.isPrimary) {
  cpus.forEach(() => {
    const worker = cluster.fork();
    worker.on('error', onWorkerError);
  });

  cluster.on('exit', (error) => {
    const newWorker = cluster.fork();
    newWorker.on('error', onWorkerError);
    console.debug('\x1b[33m[WORKER PROCESS EXITED]\x1b[0m', newWorker.process.pid);
    console.debug(error);
  });
} else {
  const server = app.listen(port, () => {
    console.debug(`\x1b[32m[Servidor up http://localhost:${port}]\x1b[0m`);
  });
  server.on('error', (error) => console.debug(error));
}
