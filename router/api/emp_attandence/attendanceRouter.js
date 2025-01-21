const { db_Insert } = require('../../../model/mysqlModel');
const { save_attendance_in, save_attendance_out } = require('../../../modules/api/attendance_module/attendanceModule');

const express = require('express'),
attendanceRouter = express.Router(),
dateFormat = require('dateformat');

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

module.exports = {attendanceRouter}