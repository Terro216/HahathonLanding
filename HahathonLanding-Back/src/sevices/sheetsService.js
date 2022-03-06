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

      const row = encryptionService.encrypt(res.data.updates.updatedRange.split(':')[1].slice(1));
      console.log(row);
    } catch (e) {
      console.log(e);
      console.warn(data);
    }
  },

  confirm: async (data) => {
    try {
      const row = encryptionService.decrypt(data);

      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetsId,
        range: `Sheet1!J${row}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [['Yes']]
        }
      });
    } catch (e) {
      console.log(e);
      console.warn(data);
    }
  }
}
