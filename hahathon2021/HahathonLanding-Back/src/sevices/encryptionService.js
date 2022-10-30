const crypto = require('crypto');

const key = require('../config').secret.slice(32);

const algorithm = 'aes-256-cbc';
const iv = key.slice(16);


module.exports = {
  encrypt: (data) => {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
  },

  decrypt: (data) => {
    let encryptedText = Buffer.from(data, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
}
