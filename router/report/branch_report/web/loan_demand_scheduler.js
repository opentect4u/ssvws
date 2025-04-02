const { db_Select, db_Insert } = require("../../../../model/mysqlModel");
const { getLoanDmd } = require("../../../../modules/api/masterModule");

const express = require("express"),
  loan_demand_scheduler = express.Router(),
  dateFormat = require("dateformat");

loan_demand_scheduler.get("/loan_demand_scheduler", async (req, res) => {
  try {
    var data = req.query;

    var select = "branch_code,closed_upto,DATE_ADD(closed_upto, INTERVAL 1 MONTH) AS next_month",
      table_name = "td_month_close",
      whr = `demand_flag = 'N'`,
      order = null;
    var data_branch_demand = await db_Select(select, table_name, whr, order);

    if (data_branch_demand.suc > 0 && data_branch_demand.msg.length > 0) {
      for (let dt of data_branch_demand.msg) {
        let closed_upto = dateFormat(dt.closed_upto, "yyyy-mm-dd");
        let closed_upto_next = dateFormat(dt.next_month, "yyyy-mm-dd");

        let select = "loan_id",
          table_name = "td_loan",
          whr = `branch_code = '${dt.branch_code}' AND outstanding > 0`,
          order = null;
        var loan_id_data_demand = await db_Select(
          select,
          table_name,
          whr,
          order
        );

        if (loan_id_data_demand.suc > 0 && loan_id_data_demand.msg.length > 0) {
          for (let loan of loan_id_data_demand.msg) {
            try {
              let demandBalance = await getLoanDmd(loan.loan_id, closed_upto_next);
              let demand = demandBalance.demand.ld_demand || 0;

              table_name = "td_loan_month_demand",
                fields = "(demand_date,loan_id,branch_code,dmd_amt,remarks)",
                values = `('${closed_upto_next}','${loan.loan_id}','${dt.branch_code}','${demand}','Demand of ${closed_upto_next}')`,
                whr = null,
                flag = 0;
              var loan_demand_data = await db_Insert(
                table_name,
                fields,
                values,
                whr,
                flag
              );
            } catch (err) {
              console.error(`Error processing loan ${loan.loan_id}:`, err);
            }
          }
        }
         //update
         table_name = "td_month_close",
         fields = `demand_flag = 'Y'`,
         values = null,
         whr = `branch_code = '${dt.branch_code}' AND closed_upto = '${closed_upto}'`,
         flag = 1;
         var update_demand_flag = await db_Insert(table_name, fields, values, whr, flag);
      }
      return res.json({ success: true, message: "Data inserted successfully"});
    } else {
      return res.json({ success: false, message: "No branches found" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.json({ success: false, error: "Internal Server Error" });
  }
});

module.exports = { loan_demand_scheduler };
