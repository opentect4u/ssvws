const { db_Select } = require('../../../../../model/mysqlModel');
const { fetch_last_date } = require('../../../../../modules/api/masterModule');

const express = require('express'),
app_attendanceRouter = express.Router(),
dateFormat = require('dateformat');

app_attendanceRouter.post("/attendance_report", async (req, res) => {
    try {
        var data = req.body;
        
        var get_last_day = await fetch_last_date(data.get_year,data.get_month)
        console.log(get_last_day,'last');
        
        var get_first_day = (data.get_year) + '-' + (data.get_month) + '-' + '01'
        console.log(get_first_day,'ju');
        
        
        var select = "a.sl_no,a.in_date_time,a.out_date_time,b.emp_name",
        table_name = "td_emp_attendance a, md_employee b",
        whr = `a.emp_id = b.emp_id AND date(a.in_date_time) BETWEEN '${get_first_day}' AND '${get_last_day}' AND b.emp_id = '${data.emp_id}'`,
        order = null;
        var atten_report_dt = await db_Select(select,table_name,whr,order);

        res.send(atten_report_dt)
    } catch (error) {
        console.error("Error fetching attendance report:", error);
        res.send({ suc: 0, msg: "An error occurred" });
    }
})

module.exports = {app_attendanceRouter}