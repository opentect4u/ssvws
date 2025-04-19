const { db_Delete, db_Select } = require('../../../../model/mysqlModel');

const express = require('express'),
dmd_proCallRouter = express.Router(),
dateFormat = require('dateformat');

 //call procedure p_loan_demand to get loan demand balance details and insert into tt_loan_demand table
 dmd_proCallRouter.post("/call_demand_proc", async (req, res) => {
    try {
        var data = req.body;
        console.log(data,'juju');
       var date_query = `LAST_DAY(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01')) AS month_last_date`;
       var first_date_query = `STR_TO_DATE(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01'), '%Y-%m-%d') AS first_day_of_month`;
        
       var dateResult = await db_Select(date_query);
       var first_dateResult = await db_Select(first_date_query);

       var from_dt = dateFormat(first_dateResult.msg[0].first_day_of_month, 'yyyy-mm-dd');
       var to_dt = dateFormat(dateResult.msg[0].month_last_date, 'yyyy-mm-dd');
       console.log(from_dt,to_dt,'dt');
       

        if (!data.branches || !Array.isArray(data.branches) || data.branches.length === 0) {
            return res.send({ suc: 0, msg: "Invalid input data" });
        }

        //Delete existing data against branch_code
        // const branchCodes = data.branches.map(b => `'${b.branch_code}'`).join(",");
        var delete_demand_data = await db_Delete('tt_loan_deamnd',null);

        //Call procedure in a loop for each branch_code
        for (let dt of data.branches) {
            var insert_demand_data = await db_Select(null,null,null,null,true,`CALL p_loan_demand('${from_dt}','${to_dt}','${dt.branch_code}')`);
        }
        res.send({ suc: 1, msg: "Procedure called successfully for all branches" });
    }catch(error){
        console.error("Error fetching loan outstanding procedure:", error);
        res.send({ suc: 0, msg: "An error occurred" });
    }    
 });

module.exports = {dmd_proCallRouter}