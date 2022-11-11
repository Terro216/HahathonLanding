const expressLoader = require('./express');
const googleApiLoader = require('./googleApi');

module.exports = async (app) => {
  console.log('Loading application...');

  await expressLoader(app);
  await googleApiLoader(app);

  console.log('Application loaded successfully!\n');
}
