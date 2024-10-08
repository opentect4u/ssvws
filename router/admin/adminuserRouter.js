const adminuserRouter = require('express').Router();
dateFormat = require('dateformat');
const bcrypt = require("bcrypt");
const { db_Insert, db_Select } = require('../../model/mysqlModel');

adminuserRouter.post('/save_profile_web', async (req, res) => {
    var data = req.body;
    console.log(data);
    const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

    var table_name = "md_employee",
    fields = `emp_name = '${data.emp_name}', branch_id = '${data.branch_id}', phone_home = '${data.phone_home}', 
    phone_mobile = '${data.phone_mobile}', email = '${data.email}', gender = '${data.gender}', modified_by = '${data.emp_name}', modified_dt = '${datetime}'`,
    values = null
    whr = `emp_id = '${data.emp_id}'`,
    flag = 1;
    var res_dt = await db_Insert(table_name,fields,values,whr,flag)
    res.send(res_dt)
});

adminuserRouter.post('/password_change', async (req, res) => {
    var data = req.body, result;
    console.log(data,'pwd');
    const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

    var select = "emp_id,password",
    table_name = "md_user",
    whr = `emp_id='${data.emp_id}'`;
    var log_dt = await db_Select(select,table_name,whr,null)

    if (log_dt.suc > 0) {
        if (log_dt.msg.length > 0) {
          if (await bcrypt.compare(data.password.toString(), log_dt.msg[0].password)) {
            try{
                await db_Insert('md_user', `modified_by = "${data.emp_id}", modified_at="${datetime}"`, null, `emp_id='${log_dt.msg[0].emp_id}'`, 1)
            }catch (error) {
                console.log(err);
            }
            res.send({ suc: 1, msg: "MIS changhed password successfully"});
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
    
})


module.exports = {adminuserRouter}