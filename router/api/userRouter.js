const userRouter = require('express').Router();
dateFormat = require('dateformat');
const bcrypt = require("bcrypt");
const { app_login_data, bm_login_data, superadmin_login_data } = require('../../modules/api/userModule');
const { db_Insert, db_Select } = require('../../model/mysqlModel');
const { createToken, generateRefreshToken, verifyRefreshToken } = require('../../middleware/authMiddleware');

userRouter.post("/fetch_emp_type", async (req, res) => {
  try {
    var data = req.body;

    var select = "a.user_type id,b.user_type",
      table_name = "md_user a, md_user_type b",
      whr = `a.user_type = b.type_code
    AND a.emp_id = '${data.emp_id}'`,
      order = null;
    var fetch_emp_type = await db_Select(select, table_name, whr, order);

    if (fetch_emp_type.suc > 0 && fetch_emp_type.msg.length > 0) {
      res.send(fetch_emp_type)
    } else {
      res.send({ suc: 0, msg: "No data found" })
    }
  } catch (error) {
    console.error(error);
    return res.send({ suc: 0, msg: "Internal Server error", error: error.message });
  }
});

userRouter.post("/fetch_brn_assign", async (req, res) => {
  try {
    var data = req.body;

    var select = "a.branch_assign_id code,b.branch_name name",
      table_name = "td_assign_branch_user a, md_branch b",
      whr = `a.branch_assign_id = b.branch_code AND brn_status = 'O' AND a.ho_user_id = '${data.emp_id}'`,
      order = `ORDER BY b.branch_name`;
    var fetch_brn = await db_Select(select, table_name, whr, order);

    if (fetch_brn.suc > 0 && fetch_brn.msg.length > 0) {
      res.send(fetch_brn)
    } else {
      res.send({ suc: 0, msg: "No data found" })
    }
  } catch (error) {
    console.error(error);
    return res.send({ suc: 0, msg: "Internal Server error", error: error.message });
  }
});

userRouter.get("/fetch_app_version", async (req, res) => {
  var data = req.body;

  var select = "version",
    table_name = "md_app_version",
    whr = null,
    order = null;
  var app_data = await db_Select(select, table_name, whr, order)

  res.send(app_data)
});

// userRouter.post('/login_app', async (req, res) => {
//   var data = req.body,
//     result;
//   const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
//   // console.log(data, 'Received Data');

//   try {
//     let requiredVersion = null;

//     // Fetch app version if flag is 'A'
//     if (data.flag === 'A') {
//       let app_data = await db_Select("version", "md_app_version", null, null);
//       // console.log(app_data,'poii');

//       if (app_data.suc > 0 && app_data.msg.length > 0) {
//         requiredVersion = app_data.msg[0].version; // Extract version
//       } else {
//         return res.send({ suc: 0, msg: "App version information not found.", requiredVersion });
//       }

//       // console.log("Required Version:", requiredVersion, "User App Version:", data.app_version);

//       // Check app version
//       if (!data.app_version || data.app_version != requiredVersion) {
//         return res.send({ suc: 0, msg: `Please update your app to version ${requiredVersion}` });
//       }
//     }

//     // Proceed with login after version check
//     var log_dt = await app_login_data(data);

//     if (log_dt.suc > 0 && log_dt.msg.length > 0) {
//       let user = log_dt.msg[0];
//       // console.log(user,'user123');
//       let passwordMatch = await bcrypt.compare(data.password.toString(), user.password);

//       if (passwordMatch) {
//         // const tokenPayload = { emp_id: user.emp_id, user_type: user.user_type };
//         try {
//           var checkUserToken = false
//           if (user.session_id && user.session_id !== 'null' && user.refresh_token && user.refresh_token !== 'null') {
//             // console.log('Request Session ID:', data.session_id);
//             // console.log('Stored Session ID:', user.session_id);
        
//             if (String(data.session_id).trim() === String(user.session_id).trim()) {
//                 // console.log("Session IDs Match!");
//                 var verify_token = await verifyRefreshToken(user.refresh_token, data.emp_id);
//                 if (verify_token.suc === 2) {
//                     checkUserToken = true;
//                 }
//             } else {
//                 console.log("Session IDs Do Not Match!");
//                 return res.send({ suc: 0, msg: "Session id not matched" });
//             }
//         } else {
//             checkUserToken = true;
//         }

//         // if ((user.session_id != '' || user.session_id != null || user.session_id != 'null') && (user.refresh_token != '' || user.refresh_token != null || user.refresh_token != 'null')) {
//           //   console.log(typeof(user.session_id),typeof(user.refresh_token));
//           //   console.log(user.session_id,user.refresh_token);
            
//           //   if (data.session_id == user.session_id) {
//           //     console.log(data.session_id,user.session_id,'------');
              
//           //     var verify_token = await verifyRefreshToken(user.refresh_token, data.emp_id)
//           //     if (verify_token.suc == 2) {
//           //       checkUserToken = true
//           //     }
//           //   }else{
//           //     return res.send({ suc: 0, msg: "Session id not matched" });
//           //   }
//           // } else {
//           //   checkUserToken = true
//           // }

//           // return new Error()
//           //token 18.03.2025

//           delete user.password;
//           delete user.refresh_token;

//           const token = await createToken(user);
//           if (checkUserToken) {
//             const refresh_token = await generateRefreshToken(user, data.session_id);
//             if (!refresh_token) {
//               console.error("Refresh Token generation failed!"); // 🔍 Error if token is null/undefined
//               return res.send({ suc: 0, msg: "Refresh Token generation failed." });
//             }
//             await db_Insert('md_user', `refresh_token = '${refresh_token}', session_id = '${data.session_id}', created_by = '${data.emp_id}', created_at='${datetime}'`, null, `emp_id='${user.emp_id}'`, 1);
//           }

//           //  console.log('Generated Token:',token);
//           //  console.log('Refresh token:', refresh_token);


//           if (!token) {
//             console.error("Token generation failed!"); // 🔍 Error if token is null/undefined
//             return res.send({ suc: 0, msg: "Token generation failed." });
//           }

//           return res.send({ suc: 1, msg: `${user.user_type} Login successfully`, user_dtls: user, token });
//         } catch (err) {
//           console.error("Error inserting user log:", err);
//         }
//       } else {
//         return res.send({ suc: 0, msg: "Incorrect user ID or password" });
//       }
//     } else {
//       return res.send({ suc: 2, msg: "No user data found", dt: log_dt });
//     }
//   } catch (error) {
//     console.error("Login Error:", error);
//     return res.send({ suc: 0, msg: "An unexpected error occurred, please try again." });
//   }
// });

userRouter.post('/login_app', async (req, res) => {
  var data = req.body,
    result;
  const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
  // console.log(data, 'Received Data');

  try {
    let requiredVersion = null;

    const isWebLogin = data.flag === 'W';

    // Fetch app version if flag is 'A'
    if (!isWebLogin && data.flag === 'A') {
      let app_data = await db_Select("version", "md_app_version", null, null);
      // console.log(app_data,'poii');

      if (app_data.suc > 0 && app_data.msg.length > 0) {
        requiredVersion = app_data.msg[0].version; // Extract version
      } else {
        return res.send({ suc: 0, msg: "App version information not found.", requiredVersion });
      }

      // console.log("Required Version:", requiredVersion, "User App Version:", data.app_version);

      // Check app version
      if (!data.app_version || data.app_version != requiredVersion) {
        return res.send({ suc: 0, msg: `Please update your app to version ${requiredVersion}` });
      }
      }else if (isWebLogin) {
        // Web Login Conditions
        if (data.app_version !== '0' || data.session_id !== '0') {
          return res.send({ suc: 0, msg: "Invalid login parameters for web." });
        }
    }
    
    // Proceed with login after version check
    var log_dt = await app_login_data(data);

    if (log_dt.suc > 0 && log_dt.msg.length > 0) {
      let user = log_dt.msg[0];
      // console.log(user,'user123');
      let passwordMatch = await bcrypt.compare(data.password.toString(), user.password);

      if (passwordMatch) {
        // const tokenPayload = { emp_id: user.emp_id, user_type: user.user_type };
        try {
          var checkUserToken = false
          if (!isWebLogin && user.session_id && user.session_id !== 'null' && user.refresh_token && user.refresh_token !== 'null') {
            // console.log('Request Session ID:', data.session_id);
            // console.log('Stored Session ID:', user.session_id);
        
            // if (String(data.session_id).trim() === String(user.session_id).trim()) {
              if (String(data.session_id).trim() === '0' || String(data.session_id).trim() === String(user.session_id).trim()) {
                // console.log("Session IDs Match!");
                var verify_token = await verifyRefreshToken(user.refresh_token, data.emp_id);
                if (verify_token.suc === 2) {
                    checkUserToken = true;
                }
            } else {
                console.log("Session IDs Do Not Match!");
                return res.send({ suc: 0, msg: "Session id not matched" });
            }
        } else {
            checkUserToken = true;
        }

        // if ((user.session_id != '' || user.session_id != null || user.session_id != 'null') && (user.refresh_token != '' || user.refresh_token != null || user.refresh_token != 'null')) {
          //   console.log(typeof(user.session_id),typeof(user.refresh_token));
          //   console.log(user.session_id,user.refresh_token);
            
          //   if (data.session_id == user.session_id) {
          //     console.log(data.session_id,user.session_id,'------');
              
          //     var verify_token = await verifyRefreshToken(user.refresh_token, data.emp_id)
          //     if (verify_token.suc == 2) {
          //       checkUserToken = true
          //     }
          //   }else{
          //     return res.send({ suc: 0, msg: "Session id not matched" });
          //   }
          // } else {
          //   checkUserToken = true
          // }

          // return new Error()
          //token 18.03.2025

          delete user.password;
          delete user.refresh_token;

          const token = await createToken(user);
          if (!isWebLogin || checkUserToken) {
            const refresh_token = await generateRefreshToken(user, data.session_id);
            if (!refresh_token) {
              console.error("Refresh Token generation failed!"); // 🔍 Error if token is null/undefined
              return res.send({ suc: 0, msg: "Refresh Token generation failed." });
            }
            await db_Insert('md_user', `refresh_token = '${refresh_token}', session_id = '${data.session_id}', created_by = '${data.emp_id}', created_at='${datetime}'`, null, `emp_id='${user.emp_id}'`, 1);
          }else {
            await db_Insert('md_user', `created_by = '${data.emp_id}', created_at='${datetime}'`, null, `emp_id='${user.emp_id}'`, 1);

          }

          //  console.log('Generated Token:',token);
          //  console.log('Refresh token:', refresh_token);


          if (!token) {
            console.error("Token generation failed!"); // 🔍 Error if token is null/undefined
            return res.send({ suc: 0, msg: "Token generation failed." });
          }

          return res.send({ suc: 1, msg: `${user.user_type} Login successfully`, user_dtls: user, token });
        } catch (err) {
          console.error("Error inserting user log:", err);
        }
      } else {
        return res.send({ suc: 0, msg: "Incorrect user ID or password" });
      }
    } else {
      return res.send({ suc: 2, msg: "No user data found", dt: log_dt });
    }
  } catch (error) {
    console.error("Login Error:", error);
    return res.send({ suc: 0, msg: "An unexpected error occurred, please try again." });
  }
});

userRouter.post('/logout', async (req, res) => {
  var data = req.body;
  // console.log(data,'logoutdata');
  
  var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

  var table_name = "md_user";
  fields = `refresh_token = NULL, session_id = NULL, modified_by = '${data.modified_by}', modified_at = '${datetime}'`;
  values = null;
  whr = `emp_id = '${data.emp_id}' AND session_id = '${data.session_id}'`;
  flag = 1;

  try {
    var del_ref_token = await db_Insert(table_name, fields, values, whr, flag);
    res.send(del_ref_token);
  } catch (error) {
    console.error('SQL Error:', error);
    res.send({ error: 'Database error. Please try again.' });
  }
});

userRouter.post("/clear_session", async (req, res) => {
  try{
 var data = req.body;
//  console.log(data,'clear_sessiondata');
 var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

 var select = "refresh_token,session_id",
 table_name = "md_user",
 whr = `emp_id = '${data.emp_id}'`,
 order = null;
 var employee_data = await db_Select(select,table_name,whr,order);

 if (employee_data.suc > 0 && employee_data.msg.length > 0) {
  var table_name = "md_user";
  fields = `refresh_token = NULL, session_id = NULL, modified_by = '${data.modified_by}', modified_at = '${datetime}'`;
  values = null;
  whr = `emp_id = '${data.emp_id}'`;
  flag = 1;
  var clear_token_session = await db_Insert(table_name, fields, values, whr, flag);
  res.send(clear_token_session);
 }
  }catch(error) {
    console.error('SQL Error:', error);
    res.send({ error: 'Please try again.' });
  }
});

userRouter.post("/check_session_id", async (req, res) => {
try{
  var data = req.body;
  // console.log(data,'check_session_iddata');

 var select = "session_id",
 table_name = "md_user",
 whr = `emp_id = '${data.emp_id}'`,
 order = null;
 var fetch_session_id = await db_Select(select,table_name,whr,order);

 let isMatch = false; // Declare isMatch with a default value

 if (fetch_session_id.suc > 0 && fetch_session_id.msg.length > 0) {
   isMatch = fetch_session_id.msg[0].session_id === data.session_id;
 } 
 res.send({ suc: 1, match: isMatch });
}catch(error){
  console.error('SQL Error:', error);
    res.send({ suc: 0, error: 'Please try again.' });
}
});

module.exports = { userRouter }