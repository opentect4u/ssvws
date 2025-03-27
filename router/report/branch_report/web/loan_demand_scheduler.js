const { db_Select } = require('../../../../model/mysqlModel');

const express = require('express'),
loan_demand_scheduler = express.Router(),
dateFormat = require('dateformat');

loan_demand_scheduler.post("/loan_demand_scheduler", async (req, res) => {
    try {
        var data = req.body;

        var select = "branch_code,closed_upto",
        table_name = "td_month_close",
        whr = `demand_flag = 'N'`,
        order = null;
        var data_branch_demand = await db_Select(select, table_name, whr, order);

        if (data_branch_demand.suc > 0 && data_branch_demand.msg.length > 0) {
            var branch_codes = data_branch_demand.msg.map(item => item.branch_code);
            var closed_uptos_demand = data_branch_demand.msg.map(item => item.closed_upto);
            let demandData = [];
            console.log(branch_codes,closed_uptos_demand,'demandData');
            

            for (let branch_code of branch_codes) {
                let select = "branch_code,loan_id",
                    table_name = "td_loan",
                    whr = `branch_code = '${branch_code}' AND outstanding > 0`,
                    order = null;
                    var data_demand = await db_Select(select, table_name, whr, order);
                
                if (data_demand.suc > 0 && data_demand.msg.length > 0) {
                    demandData.push(...data_demand.msg);
                }
            }
            if (demandData.length === 0) {
                return res.json({ success: false, message: "No loans found with outstanding balance" });
            }
            return res.json({ success: true, data: demandData }); 
        }else {
            return res.json({ success: false, message: "No branches found" });
        }
    }catch (error) {
        console.error("Error:", error);
        return res.json({ success: false, error: "Internal Server Error" });
    }
});

module.exports = {loan_demand_scheduler}