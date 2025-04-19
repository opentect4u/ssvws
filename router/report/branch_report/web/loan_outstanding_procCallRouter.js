const { db_Delete, db_Select } = require('../../../../model/mysqlModel');

const express = require('express'),
outstanding_procCallRouter = express.Router(),
dateFormat = require('dateformat');

 //call procedure p_loan_outstanding to get loan outstanding balance details and insert into tt_loan_outstanding table
 outstanding_procCallRouter.post("/call_outstanding_proc", async (req, res) => {
    try {
        var data = req.body;
        // console.log(data,'juju');
        

        if (!data.branches || !Array.isArray(data.branches) || data.branches.length === 0) {
            return res.send({ suc: 0, msg: "Invalid input data" });
        }

        //Delete existing data against branch_code
        const branchCodes = data.branches.map(b => `'${b.branch_code}'`).join(",");
        var delete_data = await db_Delete('tt_loan_outstanding',null);

        //Call procedure in a loop for each branch_code
        for (let dt of data.branches) {
            var insert_outstanding_data = await db_Select(null,null,null,null,true,`CALL p_loan_out_standing('${dt.branch_code}','${data.from_dt}')`);
        }
        res.send({ suc: 1, msg: "Procedure called successfully for all branches" });
    }catch(error){
        console.error("Error fetching loan outstanding procedure:", error);
        res.send({ suc: 0, msg: "An error occurred" });
    }    
 });

 module.exports = {outstanding_procCallRouter}