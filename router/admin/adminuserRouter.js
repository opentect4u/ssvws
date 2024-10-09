const adminuserRouter = require('express').Router();
dateFormat = require('dateformat');
const bcrypt = require("bcrypt");
const { db_Insert, db_Select } = require('../../model/mysqlModel');

adminuserRouter.get('/fetch_branch', async (req, res) => {
    var data = req.body;

    var select = "branch_code,branch_name,brn_addr",
    table_name = "md_branch",
    whr = null,
    order = null;
    var branch_dt = await db_Select(select,table_name,whr,order)
    res.send(branch_dt);
})

adminuserRouter.post('/save_profile_web', async (req, res) => {
    var data = req.body;
    console.log(data);
    const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

    var table_name = "md_employee",
    fields = `emp_name = '${data.emp_name != '' ? data.emp_name : ''}', branch_id = '${data.branch_id != '' ? data.branch_id : ''}', 
    phone_mobile = '${data.phone_mobile}', email = '${data.email}', gender = '${data.gender}', modified_by = '${data.emp_name}', modified_dt = '${datetime}'`,
    values = null
    whr = `emp_id = '${data.emp_id}'`,
    flag = 1;
    var res_dt = await db_Insert(table_name,fields,values,whr,flag)
    res.send(res_dt)
});

adminuserRouter.post('/password_change_user', async (req, res) => {
    var data = req.body, result;
    console.log(data,'pwd');
    const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

    var select = "emp_id,password",
    table_name = "md_user",
    whr = `emp_id='${data.emp_id}'`;
    var res_dt = await db_Select(select,table_name,whr,null)

    if(res_dt.suc > 0) {
        if(res_dt.msg.length > 0){
          if (await bcrypt.compare(data.old_pwd, res_dt.msg[0].password)) {
                var pass = bcrypt.hashSync(data.new_pwd, 10);
                var table_name = "md_user",
                fields = `password = '${pass}', modified_by='${data.emp_name}', modified_at='${datetime}'`,
                whr = `emp_id = '${data.emp_id}'`,
                flag = 1;
                var reset_pass = await db_Insert(table_name,fields,null,whr,flag);
                res.send({ suc: 1, msg: "Password updated successfully" });
        }else {
        result = {
            suc: 0,
            msg: "Please check your userid or password",
          };
          res.send(result)
      }
    }else {
        result = { suc: 2, msg: "No data found", dt: log_dt };
        res.send(result)
    }
    }else {
        result = { suc: 0, msg: log_dt.msg, dt: log_dt };
        res.send(result)
    }
});
    


module.exports = {adminuserRouter}