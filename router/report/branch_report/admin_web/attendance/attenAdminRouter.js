const { db_Select } = require('../../../../../model/mysqlModel');

const express = require('express'),
attenAdminRouter = express.Router(),
dateFormat = require('dateformat');

attenAdminRouter.post("/attendance_report_admin", async (req, res) => {
    try{
    var data = req.body;

    if(data.branch_id == 'A'){
             var select = "a.emp_id,a.in_date_time,a.out_date_time,a.in_addr,a.out_addr,a.attan_status,a.clock_status,a.attn_reject_remarks,a.late_in,a.early_out,b.emp_name",
             table_name = "td_emp_attendance a, md_employee b",
             whr = `a.emp_id = b.emp_id AND date(a.in_date_time) BETWEEN '${data.from_date}' AND '${data.to_date}'`
             order = null;
             var atten_report = await db_Select(select,table_name,whr,order);

             res.send(atten_report)
           }else {
            var select = "a.emp_id,a.in_date_time,a.out_date_time,a.in_addr,a.out_addr,a.attan_status,a.clock_status,a.attn_reject_remarks,a.late_in,a.early_out,b.emp_name",
            table_name = "td_emp_attendance a, md_employee b",
            whr = `a.emp_id = b.emp_id AND date(a.in_date_time) BETWEEN '${data.from_date}' AND '${data.to_date}' AND b.branch_id = '${data.branch_id}'`,
            order = null;
            var atten_report = await db_Select(select,table_name,whr,order);

            res.send(atten_report)
         }
        } catch (error) {
            console.error("Error fetching attendance report:", error);
            res.send({ suc: 0, msg: "An error occurred" });
        }
});

module.exports = {attenAdminRouter}