const { db_Delete, db_Select } = require('../../../../model/mysqlModel');

const express = require('express'),
portfolioRouter = express.Router(),
dateFormat = require('dateformat');

portfolioRouter.post("/call_proc_portfolio", async (req, res) => {
    try {
         var data = req.body;
         console.log(data,'juju');

        if (!data.branches || !Array.isArray(data.branches) || data.branches.length === 0) {
            return res.send({ suc: 0, msg: "Invalid input data" });
        }

        //Delete existing data against branch_code
        const branchCodes = data.branches.map(b => `'${b.branch_code}'`).join(",");
        var delete_data = await db_Delete('tt_portfolio',null);

        //Call procedure in a loop for each branch_code
        for (let dt of data.branches) {
            var insert_portfolio_data = await db_Select(null,null,null,null,true,`CALL p_portfolio('${dt.branch_code}','${data.from_dt}','${data.to_dt}')`);
        }
        res.send({ suc: 1, msg: "Portfolio Procedure called successfully" });
    }catch (error) {
        console.error("Error fetching on portfolio procedure:", error);
        res.send({ suc: 0, msg: "An error occurred" });
    }
});

module.exports = {portfolioRouter}