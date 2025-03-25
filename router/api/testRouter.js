const { emp_id } = require('../../modules/admin/employee/empModule');
const { getMonthDiff, getLoanDmd, get_prn_amt, get_intt_amt, fetch_date, getLoanBal } = require('../../modules/api/masterModule');

const express = require('express'),
testRouter = express.Router(),
dateFormat = require('dateformat');

testRouter.get("/test", async (req, res) => {
    var data = req.query;

    // var get_data = await getLoanDmd(12035717,'2024-12-06')
    var get_data = await getLoanBal(158486140,'2025-03-25')
    res.send(get_data);
    // console.log(get_data,'ok');
    
});

testRouter.get("/test_1", async (req, res) => {
    var data = req.query;

    // var gets_data = await emp_id(120)
    // var gets_data = await get_prn_amt(12020622,'2025-03-06')
    // var gets_data = await get_intt_amt(12085933,'2025-03-06')
    // var get_dt_dtls = await fetch_date(101,'2025-03-08')
    res.send(get_dt_dtls);
    // console.log(get_data,'ok');
    
});

module.exports = {testRouter}