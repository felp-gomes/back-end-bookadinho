import app from './app';

const port: string | number = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`\x1b[32m[Servidor up http://localhost:${port}]\x1b[0m`);
});
