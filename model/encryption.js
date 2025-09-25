const crypto = require('crypto');

const SECRET_KEY = process.env.SECRET_KEY;
const IV = Buffer.alloc(16, 0); 

// Encryption function
function encrypt(text) {
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    crypto.createHash('sha256').update(SECRET_KEY).digest(),
    IV
  );
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
}

module.exports = { encrypt };