const jwt = require('jsonwebtoken');
require('dotenv').config()
const CryptoJS = require('crypto-js');

module.exports = {
  createToken: (userData) => {
    return new Promise((resolve, reject) => {
      if (Object.keys(userData).length > 0) {
        const token = jwt.sign(JSON.parse(JSON.stringify(userData)), process.env.SECRET_KEY, {
          expiresIn: process.env.TOKEN_EXPIRATION
        });
        resolve(token)
        console.log(token,'token');
        
      } else {
        reject('No Object Found')
      }
    })
  },
 
  authCheckForLogin: (req, res, next) => {
    const token = req.cookies?.auth_token;
      if (token){
        try {
          const verified = jwt.verify(token, process.env.SECRET_KEY);
          req.user = verified;
        } catch (err) {
          if (err.name === 'TokenExpiredError') {
            console.error("Token has expired!");
            return res.status(401).json({ error: 'Session expired, please log in again.' });
          } else {
            console.error("Invalid token:", err.message);
            return res.status(403).json({ error: 'Invalid token, please log in again.' });
          }
        }
      }else {
        return res.status(401).json({ error: 'No token found, please log in.' });
      }
    next()
  },

  // Generate Refresh Token
 generateRefreshToken: (userId) => {
  return new Promise((resolve, reject) => {
  if (Object.keys(userId).length > 0) {
    const ref_token = CryptoJS.AES.encrypt(JSON.stringify(userId), process.env.REFRESH_TOKEN_SECRET).toString()
    resolve(ref_token)
    console.log(ref_token,'ref_token');
  } else {
    reject('No Object Found')
  }
   })
},

// Verify Refresh Token
verifyRefreshToken: (ref_token)=> {
  try {
      const bytes = CryptoJS.AES.decrypt(ref_token, REFRESH_TOKEN_SECRET);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      if (!decryptedData || !decryptedData.userId) {
          throw new Error('Invalid token data');
      }

      return decryptedData;
  } catch (error) {
      console.error('Invalid token:', error.message);
      return null;
  }
},

}