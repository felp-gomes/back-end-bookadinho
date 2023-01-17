const app = require('./config/express')();
const consign = require('consign');
const PORT = process.env.PORT || 4000

//PRÉ EXECUTA AS ROTAS
consign()
  .then('src/routes')
  .then('src/model')
  .then('src/controller')
  .into(app)


const http = require('http').createServer(app);

http.listen(PORT , function () {
  console.log(`Servidor on :) 
  na porta: ${PORT}`)
})
