require('dotenv').config();

const mailer = require('./mailer');

module.exports = {
  serverPort: process.env.PORT,
  secret: process.env.SECRET,
  baseUrl: process.env.BASE_URL,
  googleAccount: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  sheetsId: process.env.GOOGLE_SHEETS_ID,
  apiPrefix: '/api/v1',
  mailer
}
