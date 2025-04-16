const { db_Select } = require('../../../model/mysqlModel');

const express = require('express'),
loan_rejectionRouter = express.Router(),
dateFormat = require('dateformat');

loan_rejectionRouter.post("/reject_loan_transactions", async (req, res) => {
    try {
        var data = req.body;

        //fetch loan id from td_loan table
        var select = "a.loan_id",
        table_name = "td_loan a LEFT JOIN md_group b ON a.group_code = b.group_code",
        whr = `a.group_code like '%${data.grp}%' OR b.group_name like '%${data.grp}%'`,
        order = null;
        var loan_details = await db_Select(select,table_name,whr,order);
        res.send(loan_details)
    }catch(error){
        console.error("Error fetching loan:", error);
        res.send({ suc: 0, msg: "An error occurred" });
    }    
});

module.exports = {loan_rejectionRouter}