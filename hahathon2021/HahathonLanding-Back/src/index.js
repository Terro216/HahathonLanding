const express = require('express');
const config = require('./config');
const loaders = require('./loaders');

global.__basedir = __dirname;

const startServer = async () => {
  const app = express();

  await loaders(app);

  app.listen(config.serverPort, () => {
    console.log(`Server started at ${config.serverPort} port.`);
  }).on('error', (err) => {
    console.log(err);
    process.exit(1);
  });
}

startServer().catch((e) => console.log(e));
