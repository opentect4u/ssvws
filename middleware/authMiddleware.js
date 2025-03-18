const jwt = require('jsonwebtoken');
require('dotenv').config()

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
}