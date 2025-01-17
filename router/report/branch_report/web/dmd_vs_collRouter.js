const { db_Select, db_RunProcedureAndFetchData } = require('../../../../model/mysqlModel');

const express = require('express'),
dmd_vs_collRouter = express.Router(),
dateFormat = require('dateformat');

//DEMAND VS COLLECTION REPORT MEMBERWISE
dmd_vs_collRouter.post("/dmd_vs_collec_report_memberwise", async (req, res) => {
    try {
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
        res.send({ suc: 0, msg: "An error occurred" });
    }
});

//DEMAND VS COLLECTION REPORT GROUPWISE
dmd_vs_collRouter.post("/dmd_vs_collec_report_groupwise", async (req, res) => {
    try {
        var data = req.body;
        const pro_name = 'p_loan_demand',
        pro_params = `?,?,?`,
        pro_params_val = [data.from_dt, data.to_dt, data.branch_code],
        sel_table_name = `tt_loan_demand a,vw_loan_demand_report b`,
        sel_fields = `a.group_code,b.group_name,a.disbursed_date,sum(a.disbursed_amount)disbursed_amount,
        a.current_roi,a.period,a.period_mode,a.installment_end_date,sum(a.total_emi)total_emi,sum(a.curr_dmd_amt + a.coll_amt)previous_demand,sum(a.curr_dmd_amt) current_demand ,sum(a.coll_amt),sum(a.current_principal)outstanding,b.co_name`,
        sel_whr_fields = `a.loan_id = b.loan_id AND (a.curr_dmd_amt + a.coll_amt + a.current_principal) > 0`,
        sel_whr_arr = [],
        sel_order = `GROUP BY a.group_code,b.group_name,a.disbursed_date,a.current_roi,a.period,a.period_mode,a.installment_end_date,b.co_name`;
        var repo_data_grpwise = await db_RunProcedureAndFetchData(pro_name, pro_params, pro_params_val, sel_fields, sel_table_name, sel_whr_fields, sel_whr_arr, sel_order);

        res.send(repo_data_grpwise)

    } catch (error) {
        console.error("Error fetching demand vs collection report groupwise:", error);
        res.send({ suc: 0, msg: "An error occurred" });
    }
});

//DEMAND VS COLLECTION REPORT COWISE
dmd_vs_collRouter.post("/dmd_vs_collec_report_groupwise", async (req, res) => {
    try {
        var data = req.body;
        const pro_name = 'p_loan_demand',
        pro_params = `?,?,?`,
        pro_params_val = [data.from_dt, data.to_dt, data.branch_code],
        sel_table_name = `tt_loan_demand a,vw_loan_demand_report b`,
        sel_fields = `a.loan_id,a.member_code,b.client_name,a.group_code,b.group_name,a.disbursed_date,a.disbursed_amount,a.current_roi,a.period,a.period_mode,a.recov_day,a.installment_end_date,a.total_emi,(a.curr_dmd_amt + a.coll_amt)previous_demand,a.curr_dmd_amt current_demand ,a.coll_amt,a.current_principal,b.co_name,b.co_id`,
        sel_whr_fields = `a.loan_id = b.loan_id AND b.co_id = '${data.co_id}' AND (a.curr_dmd_amt + a.coll_amt + a.current_principal) > 0`,
        sel_whr_arr = [],
        sel_order = `GROUP BY a.group_code,b.group_name,a.disbursed_date,a.current_roi,a.period,a.period_mode,a.installment_end_date,b.co_name`;
        var repo_data_cowise = await db_RunProcedureAndFetchData(pro_name, pro_params, pro_params_val, sel_fields, sel_table_name, sel_whr_fields, sel_whr_arr, sel_order);

        res.send(repo_data_cowise)

    } catch (error) {
        console.error("Error fetching demand vs collection report cowise:", error);
        res.send({ suc: 0, msg: "An error occurred" });
    }
});

module.exports = {dmd_vs_collRouter}