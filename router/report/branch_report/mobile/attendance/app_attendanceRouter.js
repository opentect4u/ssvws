const { db_Select } = require('../../../../../model/mysqlModel');

const express = require('express'),
app_attendanceRouter = express.Router(),
dateFormat = require('dateformat');

app_attendanceRouter.post("/attendance_report", async (req, res) => {
    try {
        var data = req.body;
        
        var get_first_day = new Date(`${data.get_year}`, `${data.get_month}`)
        get_first_day.getDate();
        var first_day = get_first_day
        res.send(first_day)
    
    } catch (error) {
        console.error("Error fetching attendance report:", error);
        res.send({ suc: 0, msg: "An error occurred" });
    }
})

module.exports = {app_attendanceRouter}