const adminuserRouter = require('express').Router();
dateFormat = require('dateformat');
const bcrypt = require("bcrypt");
const { db_Insert, db_Select } = require('../../model/mysqlModel');
const { getBankCode } = require('../../modules/api/masterModule');

adminuserRouter.get('/fetch_branch', async (req, res) => {
    var data = req.body;

    //fetch branch details
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

    //save profile details in web
    var table_name = "md_employee",
    fields = `emp_name = ${data.emp_name != '' ? `'${data.emp_name}'` : 'NULL'}, 
              branch_id = ${data.branch_id != '' ? `'${data.branch_id}'` : 'NULL'}, 
              phone_mobile = ${data.phone_mobile != '' ? `'${data.phone_mobile}'` : 'NULL'}, 
              email = ${data.email != '' ? `'${data.email}'` : 'NULL'}, 
              gender = ${data.gender != '' ? `'${data.gender}'` : 'NULL'}, 
              modified_by = '${data.emp_name}', 
              modified_dt = '${datetime}'`,
    values = null,
    whr = `emp_id = '${data.emp_id}'`,
    flag = 1;

    var res_dt = await db_Insert(table_name, fields, values, whr, flag);
    res.send(res_dt);
});



adminuserRouter.post('/password_change_user', async (req, res) => {
    var data = req.body, result;
    // console.log(data,'pwd');
    const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

    //change user password
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
        result = { suc: 2, msg: "No data found", dt: res_dt };
        res.send(result)
    }
    }else {
        result = { suc: 0, msg: res_dt.msg, dt: res_dt };
        res.send(result)
    }
});
    
adminuserRouter.post("/save_bank_dtls", async (req, res) => {
    var data = req.body;
    const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

    let bank_code = await getBankCode()

    //save bank details
    var table_name = "md_bank",
    fields = data.bank_code > 0 ? `bank_name = '${data.bank_name}', branch_name = '${data.branch_name}', ifsc = '${data.ifsc == '' ? 0 : data.ifsc}', branch_addr = '${data.branch_addr.split("'").join("\\'")}', sol_id = '${data.sol_id == '' ? 0 : data.sol_id}', phone_no = '${data.phone_no > 0 ? data.phone_no : 0}', dist_code = '${data.dist_code == '' ? 0 : data.dist_code}', modified_by = '${data.modified_by}', modified_at = '${datetime}'` : `(bank_code, bank_name, branch_name, ifsc, branch_addr, sol_id, dist_code, phone_no, created_by, created_at)`,
    values = `('${bank_code}', '${data.bank_name}', '${data.branch_name}', '${data.ifsc == '' ? 0 : data.ifsc}', '${data.branch_addr.split("'").join("\\'")}', '${data.sol_id == '' ? 0 : data.sol_id}', '${data.phone_no > 0 ? data.phone_no : 0}', '${data.dist_code == '' ? 0 : data.dist_code}', '${data.created_by}', '${datetime}')`,
    whr = data.bank_code > 0 ? `bank_code = ${data.bank_code}` : null,
    flag = data.bank_code > 0 ? 1 : 0;
    var bank_dt = await db_Insert(table_name,fields,values,whr,flag);

    res.send(bank_dt);
})

module.exports = {adminuserRouter}