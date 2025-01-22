const { db_Select } = require('../../../../../model/mysqlModel');

const express = require('express'),
app_attendanceRouter = express.Router(),
dateFormat = require('dateformat');

app_attendanceRouter.post("/attendance_report", async (req, res) => {
    try {
        var data = req.body;
        
        var select = "entry_dt,in_date_time,in_lat,in_long,in_addr,out_date_time,out_lat,out_long,out_addr,attan_status,clock_status,late_in",
        table_name = "td_emp_attendance",
        whr = `entry_dt BETWEEN '${data.from_dt}' AND '${data.to_dt}'`,
        order = null;
        var atten_report_dt = await db_Select(select,table_name,whr,order);

        res.send(atten_report_dt)

    } catch (error) {
        console.error("Error fetching attendance report:", error);
        res.send({ suc: 0, msg: "An error occurred" });
    }
})

module.exports = {app_attendanceRouter}