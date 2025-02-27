const { emp_id } = require('../../modules/admin/employee/empModule');
const { getMonthDiff, getLoanDmd } = require('../../modules/api/masterModule');

const express = require('express'),
testRouter = express.Router(),
dateFormat = require('dateformat');

testRouter.get("/test", async (req, res) => {
    var data = req.query;

    var get_data = await getLoanDmd(12035717,'2024-12-06')
    res.send(get_data);
    // console.log(get_data,'ok');
    
});

testRouter.get("/test_1", async (req, res) => {
    var data = req.query;

    var gets_data = await emp_id(120)
    res.send(gets_data);
    // console.log(get_data,'ok');
    
});

module.exports = {testRouter}