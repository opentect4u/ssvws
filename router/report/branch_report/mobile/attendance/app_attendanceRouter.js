const { db_Select } = require('../../../../../model/mysqlModel');

const express = require('express'),
app_attendanceRouter = express.Router(),
dateFormat = require('dateformat');

app_attendanceRouter.post("/attendance_report", async (req, res) => {
    try {
        var data = req.body;
        
       var first_day =  `SELECT DATE(CONCAT(@year, '-', LPAD(@month, 2, '0'), '-01')) AS first_day`;
       console.log(first_day,'kikiki');
       
       res.send(first_day)

    } catch (error) {
        console.error("Error fetching attendance report:", error);
        res.send({ suc: 0, msg: "An error occurred" });
    }
})

module.exports = {app_attendanceRouter}