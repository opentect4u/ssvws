const { db_Select } = require('../../../../model/mysqlModel');

const express = require('express'),
loan_outstandingRouter = express.Router(),
dateFormat = require('dateformat');

loan_outstandingRouter.post("/loan_outstanding_report", async (req, res) => {
    var data = req.body;

    var select = "",
    table_name = "",
    whr = ``,
    order = null;
    var loan_outstanding_dt = await db_Select(select,table_name,whr,order);

    res.send(loan_outstanding_dt);
})

module.exports = {loan_outstandingRouter}