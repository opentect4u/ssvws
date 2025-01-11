const { db_Select } = require('../../../model/mysqlModel');
const { save_user_dtls } = require('../../../modules/admin/user/userwebModule');

const express = require('express'),
userwebRouter = express.Router(),
dateFormat = require('dateformat');

userwebRouter.get("/get_user_type", async (req, res) => {
    var data = req.query;

    var select = "type_code,user_type",
    table_name = "md_user_type",
    whr = null,
    order = null;
    var type_dt = await db_Select(select,table_name,whr,order);

    res.send(type_dt)
});

userwebRouter.post("/fetch_empl_dtls", async (req, res) => {
    var data = req.body;

    var select = "a.branch_id,a.emp_name,b.branch_name",
    table_name = "md_employee a, md_branch b",
    whr = `a.branch_id = b.branch_code AND a.emp_id = '${data.emp_id}'`,
    order = null;
    var fetch_emp_dt = await db_Select (select,table_name,whr,order);

    res.send(fetch_emp_dt)

});

userwebRouter.post("/save_user_dt", async (req, res) => {
    var data = req.body;

    var save_dt = await save_user_dtls(data);
    
    res.send(save_dt);
})

module.exports = {userwebRouter}