const jwt = require('jsonwebtoken');
require('dotenv').config()
const CryptoJS = require('crypto-js');

const checkTime = (session_time) => {
  var currentDate = new Date()
  var dateDiff = Math.floor(Math.abs((currentDate - new Date(session_time)) / (1000*60*60)))
  return dateDiff
}

const diffHours = (start_dt, end_dt) => {
  const differenceInMilliseconds = new Date(end_dt) - new Date(start_dt);
  const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);
  return differenceInHours
}

module.exports = {
  // createToken: (userData) => {
  //   return new Promise((resolve, reject) => {
  //     if (Object.keys(userData).length > 0) {
  //       const token = jwt.sign(JSON.parse(JSON.stringify(userData)), process.env.SECRET_KEY, {
  //         expiresIn: process.env.TOKEN_EXPIRATION
  //       });
  //       resolve(token)
  //       // console.log(token,'token');
        
  //     } else {
  //       reject('No Object Found')
  //     }
  //   })
  // },
 
 createToken: (userData) => {
    return new Promise((resolve, reject) => {
      try{
        if (Object.keys(userData).length > 0) {
          const token = jwt.sign(JSON.parse(JSON.stringify(userData)), process.env.SECRET_KEY, {
            expiresIn: process.env.TOKEN_EXPIRATION
          });
          resolve({suc:1, msg:"Generated", token})
          // console.log(token,'token');
          
        } else {
          resolve({suc: 0, msg: 'No Object Found', token: false})
        }
      }catch(err){
        resolve({suc: 0, msg: err, token: false})
      }
    })
  },
  createCustomToken: (userData, start_dt, end_dt) => {
    return new Promise((resolve, reject) => {
      try {
        if (Object.keys(userData).length > 0) {
          const tokenExpTime = diffHours(start_dt, end_dt);
          console.log(tokenExpTime);
          
          const token = jwt.sign(JSON.parse(JSON.stringify(userData)), process.env.SECRET_KEY, {
            expiresIn: `${tokenExpTime}h`
          });
          resolve(token)
          // console.log(token,'token');

        } else {
          resolve(null)
        }
      } catch (err) {
        resolve(null)
      }
    })
  },
 
   // ------------------ AUTH MIDDLEWARE ------------------
    authenticateToken: (req, res, next) => {
    let token = null;
      // console.log(req.path, 'PATH');
    
    if (req.path === '/save_location_acc_log') {
      return next()
    }
    const authHeader = req.headers["x-access-token"] || req.headers["authorization"];
    // if (authHeader && authHeader.startsWith("Bearer ")) {
    if (authHeader) {
      // token = authHeader.split(" ")[1];
      token = authHeader;
    }

    if (!token) {
      return res.json({suc: 0, msg: "No token found, please login." });
    }

    // console.log(token);
    

    try {
      const verified = jwt.verify(token, process.env.SECRET_KEY);
      req.user = verified; // ✅ user payload available for next()
      next();
    } catch (err) {
      console.error("Auth error:", err);
      if (err.name === "TokenExpiredError") {
        return res.json({suc: 0, msg: "Token expired, please login." });
      }
      return res.json({suc: 0, msg: "Invalid token, please login." });
    }
  },

  authCheckForLogin: (req, res, next) => {
    const token = req.cookies.auth_token;
      if (token){
        try {
          const verified = jwt.verify(token, process.env.SECRET_KEY);
          req.user = verified;
        } catch (err) {
          if (err.name === 'TokenExpiredError') {
            console.error("Token has expired!");
            return res.json({ error: 'Session expired, please log in again.' });
          } else {
            console.error("Invalid token:", err.message);
            return res.json({ error: 'Invalid token, please log in again.' });
          }
        }
      }else {
        return res.json({ error: 'No token found, please log in.' });
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
    // console.log(ref_token,'ref_token');
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
            return {suc: 1, msg: 'Accepted', user_data: decryptedData.userdata}
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
// verifyToken: (req, res, next) => {
//   const authHeader = req.headers["authorization"];
  
//   if (!authHeader) {
//       return res.json({ message: "No token provided" });
//   }

//   const token = authHeader.split(" ")[1]; // Assuming "Bearer <token>"

//   jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
//       if (err) {
//           if (err.name === "TokenExpiredError") {
//               return res.json({ message: "Token has expired" });
//           } else {
//               return res.json({ message: "Invalid token" });
//           }
//       }
//       req.user = decoded; // Store decoded token data in request
//       next();
//   });
// }
}