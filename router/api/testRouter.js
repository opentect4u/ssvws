const { getMonthDiff, getLoanDmd } = require('../../modules/api/masterModule');

const express = require('express'),
testRouter = express.Router(),
dateFormat = require('dateformat');

testRouter.get("/test", async (req, res) => {
    var data = req.query;

    var get_data = await getLoanDmd(12020780,'2022-01-11')
    res.send(get_data);
    console.log(get_data,'ok');
    
})

module.exports = {testRouter}