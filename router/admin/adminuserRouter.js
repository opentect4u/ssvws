const adminuserRouter = require('express').Router();
dateFormat = require('dateformat');
const bcrypt = require("bcrypt");
const { db_Insert } = require('../../model/mysqlModel');

adminuserRouter.post('/save_profile_web', async (req, res) => {
    var data = req.body;
    console.log(data);
    const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

    var table_name = "md_employee",
    fields = `emp_name = '${data.emp_name}', branch_id = '${data.branch_id}', phone_home = '${data.phone_home}', 
    phone_mobile = '${data.phone_mobile}', email = '${data.email}', gender = '${data.gender}', modified_by = '${data.user}', modified_dt = '${datetime}'`,
    values = null
    whr = `emp_id = '${data.emp_id}' AND branch_id = '${data.branch_id}'`,
    order = null;
    var res_dt = await db_Insert(table_name,fields,values,whr,order)
    res.send(res_dt)
})


module.exports = {adminuserRouter}