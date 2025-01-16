const { db_Select } = require('../../../../model/mysqlModel');

const express = require('express'),
dmd_vs_collRouter = express.Router(),
dateFormat = require('dateformat');

dmd_vs_collRouter.post("/dmd_vs_collec_report", async (req, res) => {
    try{
        var data = req.body;

        var select = "branch_code,from_dt,to_dt,member_code,group_code,loan_id,disbursed_date,disbursed_amount,current_roi,period,period_mode,installment_start_date,installment_end_date,total_emi,curr_dmd_amt,ovd_dmd_amt,coll_amt,current_principal,overdue_principal,interest_amount",
        table_name = "tt_loan_demand",
        whr = `branch_code = '${data.branch_code}' AND date(from_dt) = '${data.from_dt}' AND date(to_dt) = '${data.to_dt}'`,
        order = null;
        var dmd_col_dt = await db_Select (select,table_name,whr,order);

        res.send(dmd_col_dt)
    } catch (error) {
        console.error("Error fetching demand vs collection report:", error);
        res.send({ suc: 0, msg: "An error occurred" });
   }
});


// dmd_vs_collRouter.post("/dmd_vs_collec_report", async (req, res) => {
//     try {

//         var data = req.body;
//         const pro_name = 'p_loan_demand',
//         pro_params = `?,?`,
//         pro_params_val = [data.branch_code, data.from_dt, data.to_dt],
//         sel_table_name = `tt_loan_demand a
//         JOIN md_group b ON a.group_code=b.group_code
//         JOIN md_member c ON a.member_code = c.member_code
//         LEFT JOIN md_employee d ON b.created_by=d.emp_id
//         JOIN td_loan e ON a.loan_id=e.loan_id
//         LEFT JOIN md_purpose f ON e.purpose = f.purp_id
//         LEFT JOIN md_sub_purpose g ON e.sub_purpose = g.sub_purp_id
//         JOIN md_scheme h ON e.scheme_id = h.scheme_id
//         LEFT JOIN md_fund i ON e.fund_id = i.fund_id`,
//         sel_fields = `a.branch_code, a.group_code, b.group_name,f.purpose_id, g.sub_purp_name, h.scheme_name, i.fund_name, a.applied_date applied_dt, Sum(a.applied_amount) applied_amt, sum(a.disbursed_amount) prn_disb_amt, a.disbursed_date disb_dt, a.current_roi curr_roi, a.installment_start_date instl_start_dt, a.period, a.period_mode, sum(a.total_emi) tot_emi, a.installment_end_date instl_end_dt, sum(a.current_principal) balance, sum(a.overdue_principal) od_balance, sum(a.interest_amount) intt_balance, (sum(a.current_principal) + sum(a.overdue_principal) + sum(a.interest_amount)) total_outstanding`,
//         sel_whr_fields = null,
//         sel_whr_arr = [],
//         sel_order = `GROUP BY a.branch_code, a.group_code, b.group_name,f.purpose_id, g.sub_purp_name, h.scheme_name, i.fund_name, a.applied_date, a.disbursed_date, a.current_roi, a.installment_start_date, a.period, a.period_mode,a.installment_end_date
//         ORDER BY a.disbursed_date`;
//         var repo_data = await db_RunProcedureAndFetchData(pro_name, pro_params, pro_params_val, sel_fields, sel_table_name, sel_whr_fields, sel_whr_arr, sel_order);

//         res.send(repo_data)

//     } catch (error) {
//         console.error("Error fetching loan outstanding report:", error);
//         res.status(500).send({ suc: 0, msg: "An error occurred" });
//     }
// });

module.exports = {dmd_vs_collRouter}