const { db_Select, db_Insert } = require('../../../../model/mysqlModel');
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
            let demandData = [];

            for (let branch of data_branch_demand.msg) {
                let { branch_code, closed_upto } = branch;

                if (!closed_upto || isNaN(new Date(closed_upto).getTime())) {
                    console.error(`Invalid date for branch ${branch_code}:`, closed_upto);
                    continue; // Skip this branch if the date is invalid
                }

                let select = "branch_code,loan_id",
                    table_name = "td_loan",
                    whr = `branch_code = '${branch_code}' AND outstanding > 0`,
                    order = null;

                let loan_id_data_demand = await db_Select(select, table_name, whr, order);

                if (loan_id_data_demand.suc > 0 && loan_id_data_demand.msg.length > 0) {
                    for (let loan of loan_id_data_demand.msg) {
                        demandData.push({ ...loan, closed_upto });
                    }
                }
            }
            
            if (demandData.length === 0) {
                return res.json({ success: false, message: "No loans found with outstanding balance" });
            }

            let calculateDemand = await Promise.all(
                demandData.map(async (demand) => {
                    let closed_uptos = dateFormat(new Date(demand.closed_upto), "yyyy-mm-dd");
                    let demandBalance = await getLoanDmd(demand.loan_id, closed_uptos);
                    return { ...demand, closed_uptos, demandBalance };
                })
            );

            for (let dt of calculateDemand) {
                var demand = dt.demandBalance.demand.ld_demand || 0;

                var table_name = "td_loan_month_demand",
                    fields = "(demand_date,loan_id,branch_code,dmd_amt,remarks)",
                    values = `('${dt.closed_uptos}','${dt.loan_id}','${dt.branch_code}','${demand}','Demand of ${dt.closed_uptos}')`,
                    whr = null,
                    flag = 0;

                var loan_demand_data = await db_Insert(table_name, fields, values, whr, flag);
            }
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