const userRouter = require('express').Router();
dateFormat = require('dateformat');
const bcrypt = require("bcrypt");
const { app_login_data, bm_login_data, superadmin_login_data } = require('../../modules/api/userModule');
const { db_Insert, db_Select } = require('../../model/mysqlModel');

userRouter.post('/logins_app', async (req, res) => {
  try{
    var data = req.body,
        result;
    const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

    var select = "type_code,user_type",
    table_name = "md_user_type",
    whr = null,
    order = null;
    var user_type_dt = await db_Select(select,table_name,whr,order);
    console.log(user_type_dt);
    

    if (user_type_dt.suc <= 0 || user_type_dt.msg.length === 0) {
      return res.send({ suc: 0, msg: "Invalid User Type" });
    }

    var userType = user_type_dt.msg[0].type_code;
    console.log(userType,'usertype');
    
    var log_dt;

   
       if(userType == '1' && userType == '2' && userType == '5'){
          //login app
          var log_dt = await app_login_data(data);
          console.log(log_dt,'log');
          
          // console.log(log_dt);
       }else {
          var log_dt = await superadmin_login_data(data);
          console.log(log_dt,'logs');
          
       }
   
    if (log_dt.suc > 0) {
        if (log_dt.msg.length > 0) {
          if (await bcrypt.compare(data.password.toString(), log_dt.msg[0].password)) {
            try{
                await db_Insert('md_user', `created_by = "${data.emp_id}", created_at="${datetime}"`, null, `emp_id='${log_dt.msg[0].emp_id}'`, 1)
            }catch (error) {
                console.log(err);
            }
            res.send({ suc: 1, msg: `${log_dt.msg[0].user_type} Login successfully`, user_dtls: log_dt.msg[0] });
          } else {
            result = {
              suc: 0,
              msg: "Please check your userid or password",
            };
            res.send(result)
          }
          } else {
            result = { suc: 2, msg: "No data found", dt: log_dt };
            res.send(result)
          }
        }  else {
          result = { suc: 0, msg: log_dt.msg, dt: log_dt };
          res.send(result)
        }
      } catch (error) {
        console.error("Login Error:", error);
        res.status(500).send({ suc: 0, msg: "Internal Server Error", error: error.message });
    }
  });

userRouter.post('/login_app', async (req, res) => {
    var data = req.body,
        result;
    const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

    //login app
    var log_dt = await app_login_data(data);
    // console.log(log_dt);
   
    if (log_dt.suc > 0) {
        if (log_dt.msg.length > 0) {
          if (await bcrypt.compare(data.password.toString(), log_dt.msg[0].password)) {
            try{
                await db_Insert('md_user', `created_by = "${data.emp_id}", created_at="${datetime}"`, null, `emp_id='${log_dt.msg[0].emp_id}'`, 1)
            }catch (error) {
                console.log(err);
            }
            res.send({ suc: 1, msg: `${log_dt.msg[0].user_type} Login successfully`, user_dtls: log_dt.msg[0] });
          } else {
            result = {
              suc: 0,
              msg: "Please check your userid or password",
            };
            res.send(result)
          }
          } else {
            result = { suc: 2, msg: "No data found", dt: log_dt };
            res.send(result)
          }
        }  else {
          result = { suc: 0, msg: log_dt.msg, dt: log_dt };
          res.send(result)
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