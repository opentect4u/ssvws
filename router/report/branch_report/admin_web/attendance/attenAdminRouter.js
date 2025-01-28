const { db_Select, db_Insert } = require('../../../../../model/mysqlModel');

const express = require('express'),
attenAdminRouter = express.Router(),
dateFormat = require('dateformat');

//fetch employee name through brancg id
attenAdminRouter.post("/fetch_employee_aginst_branch", async (req, res) => {
    try{
        var data = req.body;

        if(data.branch_id == 'A'){
        //fetch employee name through brancg id
        var select = "emp_id,branch_id,emp_name",
        table_name = "md_employee",
        whr = null,
        order = null;
        var emp_dtls = await db_Select(select,table_name,whr,order);

        res.send(emp_dtls)
        }else {
        
        var select = "emp_id,branch_id,emp_name",
        table_name = "md_employee",
        whr = `branch_id = '${data.branch_id}'`,
        order = null;
        var emp_dtls = await db_Select(select,table_name,whr,order);
        res.send(emp_dtls)
        }

    } catch (error) {
        console.error("Error fetching employee details:", error);
        res.send({ suc: 0, msg: "An error occurred" });
    }    
});

//fetch attendance report through from and to date and branch id and emp name
attenAdminRouter.post("/attendance_report_admin", async (req, res) => {
    try{
    var data = req.body;

    if(data.branch_id == 'A'){
             var select = "a.emp_id,date(a.entry_dt)entry_dt,a.in_date_time,a.out_date_time,a.in_addr,a.out_addr,a.attan_status,a.clock_status,a.attn_reject_remarks,b.emp_name",
             table_name = "td_emp_attendance a, md_employee b",
             whr = `a.emp_id = b.emp_id AND date(a.in_date_time) BETWEEN '${data.from_date}' AND '${data.to_date}'`
             order = `ORDER BY a.entry_dt,a.in_date_time,a.emp_id`;
             var atten_report = await db_Select(select,table_name,whr,order);

             res.send(atten_report)
           }else {
            var select = "a.emp_id,date(a.entry_dt)entry_dt,a.in_date_time,a.out_date_time,a.in_addr,a.out_addr,a.attan_status,a.clock_status,a.attn_reject_remarks,b.emp_name",
            table_name = "td_emp_attendance a, md_employee b",
            whr = `a.emp_id = b.emp_id AND date(a.in_date_time) BETWEEN '${data.from_date}' AND '${data.to_date}' AND b.branch_id = '${data.branch_id}'`,
            order = `ORDER BY a.entry_dt,a.in_date_time,a.emp_id`;
            var atten_report = await db_Select(select,table_name,whr,order);

            res.send(atten_report)
         }
        } catch (error) {
            console.error("Error fetching attendance report:", error);
            res.send({ suc: 0, msg: "An error occurred" });
        }
});

//reject attendance through emp id
attenAdminRouter.post("/reject_atten",async (req, res) => {
    try{
    var data = req.body;
    const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

    var table_name = "td_emp_attendance",
    fields = `attan_status = 'R', attn_reject_remarks = '${data.attn_reject_remarks}', rejected_by = '${data.rejected_by}', rejected_at = '${datetime}'`,
    values = null,
    whr = `emp_id = '${data.emp_id}' AND in_date_time = '${data.in_date_time}'`,
    flag = 1;
    var reject_dtls = await db_Insert(table_name,fields,values,whr,flag);

    res.send(reject_dtls)
} catch (error) {
    console.error("Error deleting reject report:", error);
    res.send({ suc: 0, msg: "An error occurred" });
}
});

module.exports = {attenAdminRouter}