const { db_Select } = require('../../../../../model/mysqlModel');

const express = require('express'),
app_attendanceRouter = express.Router(),
dateFormat = require('dateformat');

app_attendanceRouter.post("/attendance_report", async (req, res) => {
    try {
        var data = req.body;
        
        var select = "a.entry_dt,a.in_date_time,a.out_date_time,b.emp_name",
        table_name = "td_emp_attendance a, md_employee b",
        whr = `a.emp_id = b.emp_id AND a.entry_dt BETWEEN '${data.from_dt}' AND '${data.to_dt}' AND b.emp_id = '${data.emp_id}'`,
        order = null;
        var atten_report_dt = await db_Select(select,table_name,whr,order);

        res.send(atten_report_dt)

    } catch (error) {
        console.error("Error fetching attendance report:", error);
        res.send({ suc: 0, msg: "An error occurred" });
    }
})

module.exports = {app_attendanceRouter}