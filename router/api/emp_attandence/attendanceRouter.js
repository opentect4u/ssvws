const { db_Insert, db_Select } = require('../../../model/mysqlModel');
const { save_attendance_in, save_attendance_out } = require('../../../modules/api/attendance_module/attendanceModule');

const express = require('express'),
attendanceRouter = express.Router(),
dateFormat = require('dateformat');

//save in attendance
attendanceRouter.post("/save_in_attendance", async (req, res) => {
    var data = req.body, save_attendance_data;

    save_attendance_in(data).then(data => {
        save_attendance_data = data
    }).catch(err => {
        save_attendance_data = err
    }).finally (() => {
    res.send(save_attendance_data)
    })
});

//save out attendance
attendanceRouter.post("/save_out_attendance", async (req, res) => {
    var data = req.body, save_attendance_data_out;
    save_attendance_out(data).then(data => {
        save_attendance_data_out = data
    }).catch(err => {
        save_attendance_data_out = err
    }).finally (() => {
        res.send(save_attendance_data_out)
    })
});

//fetch attendance details
attendanceRouter.post("/get_attendance_dtls", async (req, res) => {
    var data = req.body;
   
    var select = "entry_dt,in_date_time,in_lat,in_long,in_addr,attan_status,clock_status",
    table_name = "td_emp_attendance",
    whr = `emp_id = '${data.emp_id}'`,
    order = `ORDER BY in_date_time DESC 
             LIMIT 1`;
    var atten_emp_dtls = await db_Select(select,table_name,whr,order);

    res.send(atten_emp_dtls)
});

module.exports = {attendanceRouter}