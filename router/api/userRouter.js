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
      res.send({ suc: 0, msg: "No data found", fetch_emp_type })
    }
  }catch (error) {
    console.error(error);
    return res.send({ suc: 0, msg: "Internal Server error", error: error.message });
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