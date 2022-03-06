const { google } = require("googleapis");
const sheets = google.sheets('v4');

const sheetsId = require('../config').sheetsId;
const encryptionService = require('./encryptionService');

module.exports = {
  addTeam: async (data) => {
    try {
      const res = await sheets.spreadsheets.values.append({
        spreadsheetId: sheetsId,
        range: 'Sheet1',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [
            [(new Date()).toISOString(), ...Object.values(data)]
          ]
        }
      });

      const row = res.data.updates.updatedRange.split(':')[1].slice(1);
      
    } catch (e) {
      console.log(e);
      console.warn(data)
    }



  },

  confirm: async (data) => {
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetsId,
      range: 'Sheet1!J2',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [['Yes']]
      }
    })
  }
}
