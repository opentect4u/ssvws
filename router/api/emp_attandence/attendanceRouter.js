const { db_Insert, db_Select } = require('../../../model/mysqlModel');
const { save_attendance_in, save_attendance_out } = require('../../../modules/api/attendance_module/attendanceModule');

const express = require('express'),
attendanceRouter = express.Router(),
dateFormat = require('dateformat');

  //fetch employee already logged in or not
   attendanceRouter.post("/fetch_emp_logged_dtls", async (req, res) => {
    try{
        var data = req.body;
        // console.log(data,'lo');

        // let now = new Date();
        // let year = now.getFullYear();
        // let month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        // let day = String(now.getDate()).padStart(2, '0');

        // var entry_date = `${year}-${month}-${day}`; // Format YYYY-MM-DD
        // console.log("Formatted entry_date:", entry_date);

        let entry_date = dateFormat(new Date(), "yyyy-mm-dd");

        var select = "emp_id,date(entry_dt) entry_dt,clock_status",
        table_name = "td_emp_attendance",
        whr = `emp_id = '${data.emp_id}' AND entry_dt = '${entry_date}'`,
        order = null;
        var fetch_emp_logged_dt = await db_Select(select,table_name,whr,order);
    
        res.send({suc: 1, msg:"Already clocked In", fetch_emp_logged_dt});
    }catch (error){
        res.send({suc: 0, msg: "NO data found", error});
    }
   
   });

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
   
    var select = "entry_dt,in_date_time,in_lat,in_long,in_addr,attan_status,clock_status,late_in",
    table_name = "td_emp_attendance",
    whr = `emp_id = '${data.emp_id}' AND entry_dt = date(now())`,
    order = `ORDER BY in_date_time DESC 
             LIMIT 1`;
    var atten_emp_dtls = await db_Select(select,table_name,whr,order);

    res.send(atten_emp_dtls)
});

module.exports = {attendanceRouter}