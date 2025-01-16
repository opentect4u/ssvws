const { db_Select, db_RunProcedureAndFetchData } = require('../../../../model/mysqlModel');

const express = require('express'),
dmd_vs_collRouter = express.Router(),
dateFormat = require('dateformat');

// dmd_vs_collRouter.post("/dmd_vs_collec_report", async (req, res) => {
//     try{
//         var data = req.body;

//         var select = "branch_code,from_dt,to_dt,member_code,group_code,loan_id,disbursed_date,disbursed_amount,current_roi,period,period_mode,installment_start_date,installment_end_date,total_emi,curr_dmd_amt,ovd_dmd_amt,coll_amt,current_principal,overdue_principal,interest_amount",
//         table_name = "tt_loan_demand",
//         whr = `branch_code = '${data.branch_code}' AND date(from_dt) = '${data.from_dt}' AND date(to_dt) = '${data.to_dt}'`,
//         order = null;
//         var dmd_col_dt = await db_Select (select,table_name,whr,order);

//         res.send(dmd_col_dt)
//     } catch (error) {
//         console.error("Error fetching demand vs collection report:", error);
//         res.send({ suc: 0, msg: "An error occurred" });
//    }
// });


dmd_vs_collRouter.post("/dmd_vs_collec_report", async (req, res) => {
    try {

        var data = req.body;
        const pro_name = 'p_loan_demand',
        pro_params = `?,?,?`,
        pro_params_val = [data.from_dt, data.to_dt, data.branch_code],
        sel_table_name = `tt_loan_demand a LEFT JOIN md_member b ON a.branch_code = b.branch_code AND a.member_code = b.member_code LEFT JOIN md_group c ON a.branch_code = c.branch_code AND a.group_code = c.group_code`,
        sel_fields = `a.branch_code,a.from_dt,a.to_dt,a.member_code,a.group_code,b.client_name,c.group_name,a.loan_id,a.disbursed_date,a.disbursed_amount,a.current_roi,a.period,a.period_mode,a.installment_start_date,a.installment_end_date,a.total_emi,a.curr_dmd_amt,a.ovd_dmd_amt,a.coll_amt collection_amount,(a.current_principal + a.overdue_principal + a.interest_amount) balance`,
        sel_whr_fields = null,
        sel_whr_arr = [],
        sel_order = `ORDER BY a.loan_id,a.group_code`;
        var repo_data = await db_RunProcedureAndFetchData(pro_name, pro_params, pro_params_val, sel_fields, sel_table_name, sel_whr_fields, sel_whr_arr, sel_order);

        res.send(repo_data)

    } catch (error) {
        console.error("Error fetching demand vs collection report:", error);
        res.status(500).send({ suc: 0, msg: "An error occurred" });
    }
});

module.exports = {dmd_vs_collRouter}