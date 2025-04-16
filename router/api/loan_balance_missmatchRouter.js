const { db_Select } = require('../../model/mysqlModel');

const express = require('express'),
loan_balance_missmatchRouter = express.Router(),
dateFormat = require('dateformat');

loan_balance_missmatchRouter.get("/fetch_loan_missmatch_balance", async (req, res) => {
    try {
        var data = req.query;
        // const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const currentDate = dateFormat(new Date(), "yyyy-mm-dd");
        // console.log(currentDate,'curre');
        var balance_missmatch = await db_Select(null,null,null,null,true,`CALL p_loan_balance_mismatch('${currentDate}')`);
        res.json({success: true , balance_missmatch}) ;
    } catch (error) {
        console.error("Error fetching loan mismatch balance:", error);
        res.json({ error: "Server error", details: error.message });
    }
    
});

module.exports = {loan_balance_missmatchRouter}