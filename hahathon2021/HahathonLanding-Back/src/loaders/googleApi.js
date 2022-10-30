const { google } = require('googleapis');

const googleApiKey = require('../config').googleAccount;

const auth = new google.auth.GoogleAuth({
  keyfilePath: googleApiKey,
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
  ],
});

module.exports = async (app) => {
  const authClient = await auth.getClient();
  google.options({auth: authClient});

  console.log('+ GoogleApi loaded');
}
