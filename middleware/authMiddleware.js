const jwt = require('jsonwebtoken');
require('dotenv').config()
const CryptoJS = require('crypto-js');

const checkTime = (session_time) => {
  var currentDate = new Date()
  var dateDiff = Math.floor(Math.abs((currentDate - new Date(session_time)) / (1000*60*60)))
  return dateDiff
}

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
 generateRefreshToken: (userdata,sessionId) => {
  return new Promise((resolve, reject) => {
     let datetime = new Date().getTime();
    
  if (userdata && sessionId) {
    const ref_token = CryptoJS.AES.encrypt(JSON.stringify({userdata,sessionId,datetime}), process.env.REFRESH_TOKEN_SECRET).toString()
    resolve(ref_token)
    console.log(ref_token,'ref_token');
  } else {
    reject('User ID or Session ID missing')
  }
   })
},

// Verify Refresh Token
 verifyRefreshToken: (ref_token, userId) => {
  try {
      const bytes = CryptoJS.AES.decrypt(ref_token, process.env.REFRESH_TOKEN_SECRET);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      // console.log(decryptedData,'decryptedData');
      var timeDiff = checkTime(decryptedData.datetime)
      // console.log(timeDiff, '-----------');
      if(timeDiff < process.env.REFRESH_TOKEN_EXPIRATION){
        if(decryptedData.userdata){
          if(decryptedData.userdata.emp_id == userId){
            return {suc: 1, msg: 'Accepted'}
          }else{
            return {suc: 0, msg: 'Unauthorised'}
          }
        }else{
          return {suc: 0, msg: 'Invalid refresh token.'};
        }
      }else{
        return {suc: 2, msg: 'Token time expired.'}
      }
      
      // if (!decryptedData || !decryptedData.userId) {
      //     throw new Error('Invalid token data');
      // }

      // return decryptedData;
  } catch (error) {
      console.error('Invalid token:', error.message);
      return null;
  }
},

// Middleware to check JWT token
verifyToken: (req, res, next) => {
  const authHeader = req.headers["authorization"];
  
  if (!authHeader) {
      return res.json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Assuming "Bearer <token>"

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
          if (err.name === "TokenExpiredError") {
              return res.json({ message: "Token has expired" });
          } else {
              return res.json({ message: "Invalid token" });
          }
      }
      req.user = decoded; // Store decoded token data in request
      next();
  });
}
}