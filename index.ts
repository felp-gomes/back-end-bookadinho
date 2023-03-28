import app from './src/app';

const port: string | number = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`\x1b[32mServidor up http://localhost:${port}\x1b[0m`);
});
