const userRouter = require("express").Router();
dateFormat = require("dateformat");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { decrypt } = require('../../model/decryption');
const {
  app_login_data,
  bm_login_data,
  superadmin_login_data,
  app_login_data_web,
} = require("../../modules/api/userModule");
const { db_Insert, db_Select } = require("../../model/mysqlModel");
const {
  createToken,
  generateRefreshToken,
  verifyRefreshToken,
  verifyToken,
} = require("../../middleware/authMiddleware");

userRouter.post("/get_emp_dtls_fr_finance", async (req, res) => {
 try{
   var data = req.body;
    // console.log(data,'data');
    
   //Get finance_toggle
   var fetching_fin_flag = await db_Select(
                "finance_toggle",
                "md_user",
                `emp_id = '${data.emp_id}'`,
                null
            );
            
    var finance_toggle = fetching_fin_flag.msg[0].finance_toggle;
    
    // Get user_type
    var fetch_user_type = await db_Select(
                "user_type",
                "md_user",
                `emp_id = '${data.emp_id}'`,
                null
            );
    
    var user_type = fetch_user_type.msg[0].user_type;      
    
    // If finance_toggle is 'Y' AND user_type is 4, return all branches
    if (finance_toggle === 'Y' && parseInt(user_type) === 4) {
      let fetch_all_branches = await db_Select("branch_code branch_assign_id,branch_name branch_assign_name", "md_branch", null, null);
      let all_branch_data = fetch_all_branches.msg || [];

      return res.send({
        suc: 1,
        finance_toggle,
        user_type,
        branch_assign_data: all_branch_data
      });
    }

    // If finance_toggle is 'Y' AND user_type is 1,2,5 return all branches
    if (finance_toggle === 'Y' && parseInt(user_type) === 1 || parseInt(user_type) === 2 || parseInt(user_type) === 5) {
      let fetch_all_branches_data = await db_Select("a.brn_code branch_assign_id,b.branch_name branch_assign_name", "md_user a LEFT JOIN md_branch b ON a.brn_code = b.branch_code", `a.emp_id = '${data.emp_id}'`, null);
      let all_branchs_data = fetch_all_branches_data.msg || [];

      return res.send({
        suc: 1,
        finance_toggle,
        user_type,
        branch_assign_data: all_branchs_data
      });
    }

    // If finance_toggle is 'Y' for other user types
    if (finance_toggle === 'Y' && parseInt(user_type) === 3 || parseInt(user_type) === 10 || parseInt(user_type) === 11) {  
      // Fetch assigned branch details
      var select = "a.user_type,a.branch_assign_id,b.branch_name branch_assign_name",
      table_name = "td_assign_branch_user a LEFT JOIN md_branch b ON a.branch_assign_id = b.branch_code",
      whr = `a.ho_user_id = '${data.emp_id}'`,
      order = null;
      var fetch_branch_data = await db_Select(select,table_name,whr,order);
      const branch_assign_data_raw = fetch_branch_data.msg || [];

      let user_type = null;
      const branch_assign_data = branch_assign_data_raw.map((item, index) => {
      if (index === 0) user_type = parseInt(item.user_type);
      return {
      branch_assign_id: item.branch_assign_id,
      branch_assign_name: item.branch_assign_name
      };
      });

    // Send response with all details
    res.send({
        suc: 1,
        finance_toggle: finance_toggle,
        user_type: user_type,
        // user_data: user_data,
        branch_assign_data : branch_assign_data
      });      
    } else {
      // finance_toggle not 'Y'
      res.send({
        suc: 1,
        finance_toggle: finance_toggle
      });
    }        
 }catch (err) {
        console.error("Error fetching user:", err);
        res.send({ suc: 0, message: "Failed to fetch user" });
    }
});

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
      res.send(fetch_emp_type);
    } else {
      res.send({ suc: 0, msg: "No data found" });
    }
  } catch (error) {
    console.error(error);
    return res.send({
      suc: 0,
      msg: "Internal Server error",
      error: error.message,
    });
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
      res.send(fetch_brn);
    } else {
      res.send({ suc: 0, msg: "No data found" });
    }
  } catch (error) {
    console.error(error);
    return res.send({
      suc: 0,
      msg: "Internal Server error",
      error: error.message,
    });
  }
});

userRouter.get("/fetch_app_version", async (req, res) => {
  var data = req.body;
  //  console.log('fetch_app_version');

  var select = "version",
    table_name = "md_app_version",
    whr = null,
    order = null;
  var app_data = await db_Select(select, table_name, whr, order);
  // console.log(app_data,'app_data');
  res.send(app_data);
});

userRouter.get('/fetch_branch', async (req, res) => {
    var data = req.body;

    //fetch branch details
    var select = "branch_code,branch_name,brn_addr",
    table_name = "md_branch",
    whr = `brn_status = 'O'`,
    order = `ORDER BY branch_name`;
    var branch_dt = await db_Select(select,table_name,whr,order)
    res.send(branch_dt);
})

userRouter.post("/login_web", async (req, res) => {
  var data = req.body,
    result;
    
    data.password = decrypt(data.password)
  const pattern = /^\d+$/;
  // console.log(data,'data');
  if(pattern.test(data.emp_id)){
    const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    // console.log(data, 'Received Data');
    try {
      let requiredVersion = null;

      // Fetch app version if flag is 'A'
      // if (data.flag === 'A') {
      //   let app_data = await db_Select("version", "md_app_version", null, null);
      //   // console.log(app_data,'poii');

      //   if (app_data.suc > 0 && app_data.msg.length > 0) {
      //     requiredVersion = app_data.msg[0].version; // Extract version
      //   } else {
      //     return res.send({ suc: 0, msg: "App version information not found.", requiredVersion });
      //   }

      //   // Check app version
      //   if (!data.app_version || data.app_version != requiredVersion) {
      //     return res.send({ suc: 0, msg: `Please update your app to version ${requiredVersion}` });
      //   }
      // }

      // Proceed with login after version check
      var log_dt = await app_login_data_web(data);

      // const encrypted = encrypt(data.password);
      // const decrypted = decrypt(encrypted);

      if (log_dt.suc > 0 && log_dt.msg.length > 0) {
        let user = log_dt.msg[0];
        // console.log(user,'user123');
        let passwordMatch = await bcrypt.compare(
          data.password.toString(),
          user.password
        );

        if (passwordMatch) {
          try {
            var checkUserToken = false;
            if (
              user.session_id &&
              user.session_id !== "null" &&
              user.refresh_token &&
              user.refresh_token !== "null"
            ) {
              if (
                String(data.session_id).trim() === String(user.session_id).trim()
              ) {
                // console.log("Session IDs Match!");
                var verify_token = await verifyRefreshToken(
                  user.refresh_token,
                  data.emp_id
                );
                if (verify_token.suc === 2) {
                  checkUserToken = true;
                }
              } else {
                console.log("Session IDs Do Not Match!");
                return res.send({ suc: 3, msg: "Session id not matched" });
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
            if (checkUserToken) {
              var refresh_token = await generateRefreshToken(
                user,
                data.session_id
              );
              if (!refresh_token) {
                console.error("Refresh Token generation failed!"); // 🔍 Error if token is null/undefined
                return res.send({
                  suc: 0,
                  msg: "Refresh Token generation failed.",
                });
              }
              // await db_Insert(
              //   "md_user",
              //   `refresh_token = '${refresh_token}', session_id = '${data.session_id}', created_by = '${data.emp_id}', created_at='${datetime}'`,
              //   null,
              //   `emp_id='${user.emp_id}'`,
              //   1
              // );
              await db_Insert(
              "md_user",
              `refresh_token = '${refresh_token}', session_id = '${data.session_id}'`,
              null,
              `emp_id='${user.emp_id}'`,
              1   // ✅ do not auto-update modified_by
              );
            }
            if (!token) {
              console.error("Token generation failed!"); // 🔍 Error if token is null/undefined
              return res.send({ suc: 0, msg: "Token generation failed." });
            }

            // ✅ Insert into td_log_details after successful login
            await db_Insert(
              "td_log_details",
              `(emp_id, branch_code,operation_dt, in_out_flag, device_type, remarks, ip_address)`,
              `('${user.emp_id}', '${data.branch_code}', '${datetime}', '${data.in_out_flag}', '${data.flag}', 'Login', '${data.myIP}')`,
              null,
              0
            );


            return res.send({
              suc: 1,
              msg: `${user.user_type} Login successfully`,
              user_dtls: user,
              token: token.token,
              refresh_token,
            });
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
      return res.send({
        suc: 0,
        msg: "An unexpected error occurred, please try again.",
      });
    }
  }
  else{
    return res.send({ suc: 0, msg: "Invalid Request" });
  }
});

userRouter.post("/login_app", async (req, res) => {
  var data = req.body,
    result;
  const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
  // console.log(data, 'Received Data');

  try {
    let requiredVersion = null;
    var session_id = "0";
    // console.log(data.flag,session_id,'hyhy');
    // Fetch app version if flag is 'A'
    if (data.flag === "A" && session_id) {
      let app_data = await db_Select("version", "md_app_version", null, null);
      // console.log(app_data, "poii");

      if (app_data.suc > 0 && app_data.msg.length > 0) {
        requiredVersion = app_data.msg[0].version; // Extract version
      } else {
        return res.send({
          suc: 0,
          msg: "App version information not found.",
          requiredVersion,
        });
      }

      // console.log(
      //   "Required Version:",
      //   requiredVersion,
      //   "User App Version:",
      //   data.app_version
      // );

      // Check app version
      if (data.app_version != requiredVersion) {
        return res.send({
          suc: 0,
          msg: `Please update your app to version ${requiredVersion}`,
        });
      }
    }

    // Proceed with login after version check
    var log_dt = await app_login_data(data);

    if (log_dt.suc > 0 && log_dt.msg.length > 0) {
      let user = log_dt.msg[0];
      let passwordMatch = await bcrypt.compare(
        data.password.toString(),
        user.password
      );

      if (passwordMatch) {
        try {
          var tokens = await createToken(user);
          if (!tokens) {
              console.error("Token generation failed!"); // 🔍 Error if token is null/undefined
              return res.send({ suc: 0, msg: "Token generation failed." });
            }
          //  if (!(tokenRes.suc && tokenRes.token)) {
          //     console.error("Token generation failed!"); // 🔍 Error if token is null/undefined
          //     return res.send({ suc: 0, msg: "Token generation failed." });
          //   }

          await db_Insert(
            "md_user",
            `created_by = "${data.emp_id}", created_at="${datetime}"`,
            null,
            `emp_id='${user.emp_id}'`,
            1
          );

          // insert into td_log_details
          await db_Insert(
            "td_log_details",
            `(emp_id, branch_code, operation_dt, in_out_flag, device_type, remarks)`,
            `('${user.emp_id}', '${data.branch_code == '' ? user.brn_code : data.branch_code}', '${datetime}', '${data.in_out_flag}', '${data.flag}', 'Logout')`
          );

        } catch (err) {
          console.error("Error inserting user log:", err);
        }
        return res.send({
          suc: 1,
          msg: `${user.user_type} Login successfully`,
          user_dtls: user,
          token: tokens.token
        });
      } else {
        return res.send({ suc: 0, msg: "Incorrect user ID or password" });
      }
    } else {
      return res.send({ suc: 2, msg: "No user data found", dt: log_dt });
    }
  } catch (error) {
    console.error("Login Error:", error);
    return res.send({
      suc: 0,
      msg: "An unexpected error occurred, please try again.",
    });
  }
});

userRouter.post("/logout", async (req, res) => {
  var data = req.body;
  // console.log(data,'logoutdata');

  var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

  try{

     // 🔹 Validate required fields
    if (!data.emp_id || !data.session_id) {
      return res.send({ suc: 0, msg: "Invalid logout request. Missing emp_id or session_id." });
    }
    
  var table_name = "md_user";
  // fields = `refresh_token = NULL, session_id = NULL, modified_by = '${data.modified_by}', modified_at = '${datetime}'`;
  fields = `refresh_token = NULL, session_id = NULL`;
  values = null;
  whr = `emp_id = '${data.emp_id}' AND session_id = '${data.session_id}'`;
  flag = 1;
  var del_ref_token = await db_Insert(table_name, fields, values, whr, flag);

  var table_name = "td_log_details";
  fields = `(emp_id, branch_code, operation_dt, in_out_flag, device_type, remarks, ip_address)`;
  values = `('${data.emp_id}','${data.branch_code}','${datetime}','${data.in_out_flag}','${data.flag}', 'Logout', '${data.myIP}')`;
  whr = null;
  flag = 0;
  var log_insert = await db_Insert(table_name, fields, values, whr, flag);

  res.send({
      suc: 1,
      msg: "Logout successful",
    });
  } catch (error) {
    console.error("SQL Error:", error);
    res.send({ suc: 0, error: "Database error. Please try again." });
  }
});

userRouter.post("/logout_app", async (req, res) => {
  var data = req.body;
  // console.log(data,'logoutdata');

  var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

   // 🔹 Validate required fields
    if (!data.emp_id) {
      return res.send({ suc: 0, msg: "Invalid logout request. Missing emp_id or session_id." });
    }

  try{
  var table_name = "md_user";
  fields = `refresh_token = NULL, session_id = NULL`;
  values = null;
  whr = `emp_id = '${data.emp_id}'`;
  flag = 1;
  var del_ref_token = await db_Insert(table_name, fields, values, whr, flag);

  var table_name = "td_log_details";
  fields = `(emp_id, branch_code, operation_dt, in_out_flag, device_type, remarks)`;
  values = `('${data.emp_id}', '${data.branch_code}','${datetime}','${data.in_out_flag}','${data.flag}', 'Logout')`;
  whr = null;
  flag = 0;
  var log_insert = await db_Insert(table_name, fields, values, whr, flag);

  res.send({
      suc: 1,
      msg: "Logout successful",
    });
  } catch (error) {
    console.error("SQL Error:", error);
    res.send({ suc: 0, error: "Database error. Please try again." });
  }
});

userRouter.post("/clear_session", async (req, res) => {
  try {
    var data = req.body;
    //  console.log(data,'clear_sessiondata');
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

    var select = "refresh_token,session_id",
      table_name = "md_user",
      whr = `emp_id = '${data.emp_id}'`,
      order = null;
    var employee_data = await db_Select(select, table_name, whr, order);

    if (employee_data.suc > 0 && employee_data.msg.length > 0) {
      var table_name = "md_user";
      fields = `refresh_token = NULL, session_id = NULL, modified_by = '${data.modified_by}', modified_at = '${datetime}'`;
      values = null;
      whr = `emp_id = '${data.emp_id}'`;
      flag = 1;
      var clear_token_session = await db_Insert(
        table_name,
        fields,
        values,
        whr,
        flag
      );
      res.send(clear_token_session);
    }
  } catch (error) {
    console.error("SQL Error:", error);
    res.send({ error: "Please try again." });
  }
});

userRouter.post("/check_session_id", async (req, res) => {
  try {
    var data = req.body;
    // console.log(data,'check_session_iddata');

    var select = "session_id",
      table_name = "md_user",
      whr = `emp_id = '${data.emp_id}'`,
      order = null;
    var fetch_session_id = await db_Select(select, table_name, whr, order);

    let isMatch = false; // Declare isMatch with a default value

    if (fetch_session_id.suc > 0 && fetch_session_id.msg.length > 0) {
      isMatch = fetch_session_id.msg[0].session_id === data.session_id;
    }
    res.send({ suc: 1, match: isMatch });
  } catch (error) {
    console.error("SQL Error:", error);
    res.send({ suc: 0, error: "Please try again." });
  }
});

userRouter.post("/refresh", async (req, res) => {
  // const token = req.headers['authorization']?.split(" ")[1];
  const token = req.headers["authorization"];
  // console.log(req.headers['authorization']);
  const { emp_id, session_id } = req.body;
  var verified_token = false,
    refresh_token = "",
    res_dt = {};
  try {
    const verified = jwt.verify(token, process.env.SECRET_KEY);
    verified_token = true;
  } catch (err) {
    verified_token = false;
  }
  if (!verified_token) {
    var user_data = await db_Select(
      "refresh_token, session_id",
      "md_user",
      `emp_id=${emp_id}`,
      null
    );
    if (user_data.suc > 0 && user_data.msg.length > 0) {
      if (user_data.msg[0].session_id == session_id) {
        var refresh_token_status = await verifyRefreshToken(
          user_data.msg[0].refresh_token,
          emp_id
        );
        if (refresh_token_status.suc == 1) {
          refresh_token = await createToken(refresh_token_status.user_data);
          res_dt = { suc: 1, msg: refresh_token };
        } else {
          res_dt = { suc: 0, msg: refresh_token_status.msg };
        }
      } else {
        res_dt = { suc: 0, msg: "Invalid session_id." };
      }
    } else {
      res_dt = { suc: 0, msg: "No user data found" };
    }
  } else {
    res_dt = { suc: 1, msg: token };
  }
  res.send(res_dt);
});

module.exports = { userRouter };
