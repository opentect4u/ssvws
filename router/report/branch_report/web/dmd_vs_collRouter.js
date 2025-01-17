const { db_Select, db_RunProcedureAndFetchData } = require('../../../../model/mysqlModel');

const express = require('express'),
dmd_vs_collRouter = express.Router(),
dateFormat = require('dateformat');

dmd_vs_collRouter.post("/dmd_vs_collec_report_memberwise", async (req, res) => {
    try {
       //DEMAND VS COLLECTION REPORT MEMBERWISE
        var data = req.body;
        const pro_name = 'p_loan_demand',
        pro_params = `?,?,?`,
        pro_params_val = [data.from_dt, data.to_dt, data.branch_code],
        sel_table_name = `tt_loan_demand a,vw_loan_demand_report b`,
        sel_fields = `a.loan_id,a.member_code,b.client_name,a.group_code,b.group_name,a.disbursed_date,a.disbursed_amount,a.current_roi,a.period,a.period_mode,a.recov_day,a.installment_end_date,a.total_emi,(a.curr_dmd_amt + a.coll_amt)previous_demand,a.curr_dmd_amt current_demand ,a.coll_amt,a.current_principal,b.co_name`,
        sel_whr_fields = `a.loan_id = b.loan_id AND (a.curr_dmd_amt + a.coll_amt + a.current_principal) > 0`,
        sel_whr_arr = [],
        sel_order = `ORDER BY  a.loan_id`;
        var repo_data = await db_RunProcedureAndFetchData(pro_name, pro_params, pro_params_val, sel_fields, sel_table_name, sel_whr_fields, sel_whr_arr, sel_order);

        res.send(repo_data)

    } catch (error) {
        console.error("Error fetching demand vs collection report memberwise:", error);
        res.status(500).send({ suc: 0, msg: "An error occurred" });
    }
});

module.exports = {dmd_vs_collRouter}