const CryptoJS = require('crypto-js');

const SECRET_KEY = process.env.SECRET_KEY;
const IV = Buffer.alloc(16, 0); 

// Decryption function
function decrypt(encrypted) {
  // const decipher = crypto.createDecipheriv(
  //   'aes-256-cbc',
  //   crypto.createHash('sha256').update(SECRET_KEY).digest(),
  //   IV
  // );
  // let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  // decrypted += decipher.final('utf8');
  const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return decrypted;
}

module.exports = { decrypt };