const { db_Select } = require('../../../../model/mysqlModel');

const express = require('express'),
attendancewebRouter = express.Router(),
dateFormat = require('dateformat');

//fetch employee name through branch id
attenAdminRouter.post("/fetch_employee_fr_branch", async (req, res) => {
    try{
        var data = req.body;
        //fetch employee name through branch_id
        var select = "emp_id,branch_id,emp_name",
        table_name = "md_employee",
        whr = `branch_id = '${data.branch_id}'`,
        order = null;
        var emp_dtls_web = await db_Select(select,table_name,whr,order);
        res.send(emp_dtls_web)

    } catch (error) {
        console.error("Error fetching employee details:", error);
        res.send({ suc: 0, msg: "An error occurred" });
    }    
});

module.exports = {attendancewebRouter}