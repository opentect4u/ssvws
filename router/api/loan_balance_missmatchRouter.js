const { db_Select } = require('../../model/mysqlModel');

const express = require('express'),
loan_balance_missmatchRouter = express.Router(),
dateFormat = require('dateformat');

loan_balance_missmatchRouter.get("/fetch_loan_missmatch_balance", async (req, res) => {
    try {
        var currentDate = `${dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")}`;
        // console.log(currentDate,'curre');
        var balance_missmatch = await db_Select(null,null,null,null,true,`CALL p_loan_balance_mismatch('${currentDate}')`);
        res.json(balance_missmatch) 
    } catch (error) {
        console.log(error);
        res.json({ error: "Server error" });
    }
});

module.exports = {loan_balance_missmatchRouter}