const expressLoader = require('./express');

module.exports = async (app) => {
  console.log('Loading application...');

  await expressLoader(app);

  console.log('Application loaded successfully!\n');
}
