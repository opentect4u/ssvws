const { db_Select } = require('../../../../model/mysqlModel');
const { getLoanDmd } = require('../../../../modules/api/masterModule');

const express = require('express'),
loan_demand_scheduler = express.Router(),
dateFormat = require('dateformat');

loan_demand_scheduler.get("/loan_demand_scheduler", async (req, res) => {
    try {
        var data = req.query;

        var select = "branch_code,closed_upto",
        table_name = "td_month_close",
        whr = `demand_flag = 'N'`,
        order = null;
        var data_branch_demand = await db_Select(select, table_name, whr, order);

        if (data_branch_demand.suc > 0 && data_branch_demand.msg.length > 0) {
            var branch_codes = data_branch_demand.msg.map(item => item.branch_code);
            var closed_uptos_demand = data_branch_demand.msg.map(item => item.closed_upto);
            let demandData = [];
            // console.log(branch_codes,closed_uptos_demand,'demandData');
            
            for (let branch_code of branch_codes) {
                let select = "branch_code,loan_id",
                    table_name = "td_loan",
                    whr = `branch_code = '${branch_code}' AND outstanding > 0`,
                    order = null;
                    var loan_id_data_demand = await db_Select(select, table_name, whr, order);
                
                if (loan_id_data_demand.suc > 0 && loan_id_data_demand.msg.length > 0) {
                    demandData.push(...loan_id_data_demand.msg);
                }
            }
            if (demandData.length === 0) {
                return res.json({ success: false, message: "No loans found with outstanding balance" });
            }

             // Fetch demand for each loan             
             var closed_uptos_data = dateFormat(closed_uptos_demand[0], "yyyy-mm-dd");
             console.log(closed_uptos_data,'closed_uptos_data');
             

               let calculateDemand = await Promise.all(
                demandData.map(async (demand) => {
               let demandBalance = await getLoanDmd(demand.loan_id, closed_uptos_data);
                 return { ...loan, demandBalance };
               })
             );
            return res.json({ success: true, data: calculateDemand }); 
        }else {
            return res.json({ success: false, message: "No branches found" });
        }
    }catch (error) {
        console.error("Error:", error);
        return res.json({ success: false, error: "Internal Server Error" });
    }
});

module.exports = {loan_demand_scheduler}