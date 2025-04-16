const { db_Select } = require('../../../model/mysqlModel');

const express = require('express'),
loan_rejectionRouter = express.Router(),
dateFormat = require('dateformat');

loan_rejectionRouter.post("/reject_loan_transactions", async (req, res) => {
    try {
        var data = req.body;

        //fetch loan id from td_loan table
        var select = "loan_id",
        table_name = "td_loan",
        whr = `branch_code = '${data.branch_code}' AND group_code = '${data.group_code}'`,
        order = null;
        var loan_details = await db_Select(select,table_name,whr,order);
        res.send(loan_details)
    }catch(error){
        console.error("Error fetching loan:", error);
        res.send({ suc: 0, msg: "An error occurred" });
    }    
});

module.exports = {loan_rejectionRouter}