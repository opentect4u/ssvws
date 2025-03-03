const userRouter = require('express').Router();
dateFormat = require('dateformat');
const bcrypt = require("bcrypt");
const { app_login_data, bm_login_data, superadmin_login_data } = require('../../modules/api/userModule');
const { db_Insert, db_Select } = require('../../model/mysqlModel');

userRouter.post("/fetch_emp_type", async (req, res) => {
  try{
    var data = req.body;

    var select = "a.user_type id,b.user_type",
    table_name = "md_user a, md_user_type b",
    whr = `a.user_type = b.type_code
    AND a.emp_id = '${data.emp_id}'`,
    order = null;
    var fetch_emp_type = await db_Select(select,table_name,whr,order);
  
    if(fetch_emp_type.suc > 0 && fetch_emp_type.msg.length > 0){
      res.send(fetch_emp_type)
    }else {
      res.send({ suc: 0, msg: "No data found"})
    }
  }catch (error) {
    console.error(error);
    return res.send({ suc: 0, msg: "Internal Server error", error: error.message });
  }
});

userRouter.post("/fetch_brn_assign", async (req, res) => {
  try{
    var data = req.body;

    var select = "a.branch_assign_id code,b.branch_name name",
    table_name = "td_assign_branch_user a, md_branch b",
    whr = `a.branch_assign_id = b.branch_code AND brn_status = 'O' AND a.ho_user_id = '${data.emp_id}'`,
    order = `ORDER BY b.branch_name`;
    var fetch_brn = await db_Select(select,table_name,whr,order);
  
    if(fetch_brn.suc > 0 && fetch_brn.msg.length > 0){
      res.send(fetch_brn)
    }else {
      res.send({ suc: 0, msg: "No data found"})
    }
  }catch (error) {
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
  var app_data = await db_Select(select,table_name,whr,order)

  res.send(app_data)
});

userRouter.post('/login_app', async (req, res) => {
  var data = req.body,
      result;
  const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
  console.log(data, 'Received Data');

  try {
      let requiredVersion = null;
      
      // Fetch app version if flag is 'A'
      if (data.flag === 'A') {
          let app_data = await db_Select("version", "md_app_version", null, null);
          console.log(app_data,app_data[0].version,'poii');
          
          if (Array.isArray(app_data) && app_data.length > 0) {
            requiredVersion = app_data[0].version; // Extract version
        } else {
            return res.send({ suc: 0, msg: "App version information not found.", requiredVersion });
        }
    
        // console.log("Required Version:", requiredVersion, "User App Version:", data.app_version);
    
        // Check app version
        if (!data.app_version || data.app_version < requiredVersion) {
            return res.send({ suc: 0, msg: `Please update your app to version ${requiredVersion} or higher.` });
        }
      }

      // Proceed with login after version check
      var log_dt = await app_login_data(data);

      if (log_dt.suc > 0 && log_dt.msg.length > 0) {
          let user = log_dt.msg[0];
          let passwordMatch = await bcrypt.compare(data.password.toString(), user.password);

          if (passwordMatch) {
              try {
                  await db_Insert('md_user', `created_by = "${data.emp_id}", created_at="${datetime}"`, null, `emp_id='${user.emp_id}'`, 1);
              } catch (err) {
                  console.error("Error inserting user log:", err);
              }
              return res.send({ suc: 1, msg: `${user.user_type} Login successfully`, user_dtls: user });
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



  // userRouter.post('/bm_login', async (req, res) => {
  //   var data = req.body,
  //       result;
  //   const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

  //   var bm_log_dt = await bm_login_data(data);
  //   console.log(bm_log_dt);
    
   
  //   if (bm_log_dt.suc > 0) {
  //       if (bm_log_dt.msg.length > 0) {
  //         if (await bcrypt.compare(data.password.toString(), bm_log_dt.msg[0].password)) {
  //           try{
  //               await db_Insert('md_user', `created_by = "${data.emp_id}", created_at="${datetime}"`, null, `emp_id='${bm_log_dt.msg[0].emp_id}'`, 1)
  //           }catch (error) {
  //               console.log(err);
  //           }
  //           res.send({ suc: 1, msg: "Branch Manager Login successfully", user_dtls: bm_log_dt.msg[0] });
  //         } else {
  //           result = {
  //             suc: 0,
  //             msg: "Please check your userid or password",
  //           };
  //           res.send(result)
  //         }
  //         } else {
  //           result = { suc: 2, msg: "No data found", dt: bm_log_dt };
  //           res.send(result)
  //         }
  //       }  else {
  //         result = { suc: 0, msg: log_dt.msg, dt: log_dt };
  //         res.send(result)
  //       }
  // });  

module.exports = {userRouter}