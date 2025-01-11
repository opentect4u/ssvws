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

    try {
        var select = "a.emp_id,a.user_type,b.emp_name";
        table_name = "md_user a, md_employee b";
        whr = `a.brn_code = b.branch_id AND a.emp_id = b.emp_id AND a.emp_id = '${data.emp_id}'`,
        order = null;
        var user_dt = await db_Select(select, table_name, whr, order);

        // console.log("Result from md_user query:", user_dt);


        if (user_dt.suc > 0 && user_dt.msg.length > 0) {
            // Employee ID already exists in 'md_user'
            return res.status(200).send({ suc: 0, msg: user_dt, details: "Employee already exists in md_user" });
        }

        // Step 2: Fetch employee details from 'md_employee' and branch details from 'md_branch'
        var select1 = "a.branch_id, a.emp_name, b.branch_name";
        table_name1 = "md_employee a, md_branch b";
        whr1 = `a.branch_id = b.branch_code AND a.emp_id = '${data.emp_id}'`,
        order1 = null;
        var fetch_emp_dt = await db_Select(select1, table_name1, whr1, order1);
        console.log("Result from md_employee and md_branch query:", fetch_emp_dt);
        if (fetch_emp_dt.suc > 0) {
            // Send fetched employee details
            return res.status(200).send(fetch_emp_dt);
        } else {
            // Employee ID not found in 'md_employee'
            return res.status(404).send({ suc: 0, msg: "Employee details not found" });
        }
    } catch (error) {
        // Handle errors gracefully
        console.error("Error fetching employee details:", error);
        return res.status(500).send({ suc: 0, msg: "Internal server error" });
    }
});


userwebRouter.post("/save_user_dt", async (req, res) => {
    var data = req.body;

    var save_dt = await save_user_dtls(data);
    
    res.send(save_dt);
});

userwebRouter.post("/fetch_user_details", async (req, res) => {
    var data = req.body;

    var select = "a.emp_id,a.emp_name",
    table_name = "",
    whr = null,
    order = null;
    var fetch_user = await db_Select(select,table_name,whr,order);

    res.send(fetch_user)
})

module.exports = {userwebRouter}