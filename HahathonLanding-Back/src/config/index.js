require('dotenv').config();

const mailer = require('./mailer');

module.exports = {
  serverPort: process.env.PORT,
  apiPrefix: '/api/v1',
  mailer
}
