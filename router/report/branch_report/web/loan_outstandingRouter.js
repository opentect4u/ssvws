const { db_Select, db_RunProcedureAndFetchData } = require('../../../../model/mysqlModel');
const { loan_balance_outstanding, loan_od_balance_outstanding, loan_intt_balance_outstanding } = require('../../../../modules/api/masterModule');

const express = require('express'),
loan_outstandingRouter = express.Router(),
dateFormat = require('dateformat');

loan_outstandingRouter.post("/loan_outstanding_report_memberwise", async (req, res) => {
    try {
        var data = req.body;
        const pro_name = 'p_loan_out_standing',
        pro_params = `?,?`,
        pro_params_val = [data.branch_code, data.os_dt],
        sel_table_name = `tt_loan_outstanding a, md_group b, md_member c`,
        sel_fields = `a.loan_id, a.branch_code, a.group_code, b.group_name, a.member_code, c.client_name, a.disbursed_date disb_dt, a.current_roi curr_roi, a.period, a.period_mode, a.total_emi tot_emi, a.installment_end_date instl_end_dt, a.current_principal balance, a.overdue_principal od_balance, a.interest_amount intt_balance, (a.current_principal + a.overdue_principal + a.interest_amount) total_outstanding`,
        sel_whr_fields = `a.group_code=b.group_code AND a.member_code = c.member_code`,
        sel_whr_arr = [],
        sel_order = `ORDER BY a.disbursed_date`;
        var res_dt = await db_RunProcedureAndFetchData(pro_name, pro_params, pro_params_val, sel_fields, sel_table_name, sel_whr_fields, sel_whr_arr, sel_order);
        res.send(res_dt);
    } catch (error) {
        console.error("Error fetching loan outstanding report:", error);
        res.send({ suc: 0, msg: "An error occurred" });
    }
});

loan_outstandingRouter.post("/loan_outstanding_report_groupwise", async (req, res) => {
    try {

        var data = req.body;
        const pro_name = 'p_loan_out_standing',
        pro_params = `?,?`,
        pro_params_val = [data.branch_code, data.os_dt],
        sel_table_name = `tt_loan_outstanding a
        JOIN md_group b ON a.group_code=b.group_code
        JOIN md_member c ON a.member_code = c.member_code
        LEFT JOIN md_employee d ON b.created_by=d.emp_id
        JOIN td_loan e ON a.loan_id=e.loan_id
        LEFT JOIN md_purpose f ON e.purpose = f.purp_id
        LEFT JOIN md_sub_purpose g ON e.sub_purpose = g.sub_purp_id
        JOIN md_scheme h ON e.scheme_id = h.scheme_id
        LEFT JOIN md_fund i ON e.fund_id = i.fund_id`,
        sel_fields = `a.branch_code, a.group_code, b.group_name,f.purpose_id, g.sub_purp_name, h.scheme_name, i.fund_name, a.applied_date applied_dt, Sum(a.applied_amount) applied_amt, sum(a.disbursed_amount) prn_disb_amt, a.disbursed_date disb_dt, a.current_roi curr_roi, a.installment_start_date instl_start_dt, a.period, a.period_mode, sum(a.total_emi) tot_emi, a.installment_end_date instl_end_dt, sum(a.current_principal) balance, sum(a.overdue_principal) od_balance, sum(a.interest_amount) intt_balance, (sum(a.current_principal) + sum(a.overdue_principal) + sum(a.interest_amount)) total_outstanding`,
        sel_whr_fields = null,
        sel_whr_arr = [],
        sel_order = `GROUP BY a.branch_code, a.group_code, b.group_name,f.purpose_id, g.sub_purp_name, h.scheme_name, i.fund_name, a.applied_date, a.disbursed_date, a.current_roi, a.installment_start_date, a.period, a.period_mode,a.installment_end_date
        ORDER BY a.disbursed_date`;
        var repo_data = await db_RunProcedureAndFetchData(pro_name, pro_params, pro_params_val, sel_fields, sel_table_name, sel_whr_fields, sel_whr_arr, sel_order);

        res.send(repo_data)

    } catch (error) {
        console.error("Error fetching loan outstanding report:", error);
        res.send({ suc: 0, msg: "An error occurred" });
    }
}); 

// loan_outstandingRouter.post("/loan_outstanding_report_groupwise", async (req, res) => {
//     try {
//         var data = req.body;

//         const pro_name = 'p_loan_out_standing',
//         pro_params = `?,?`,
//         pro_params_val = [data.branch_code, data.os_dt],
//         sel_table_name = `tt_loan_outstanding a
//         JOIN md_group b ON a.group_code=b.group_code
//         JOIN md_member c ON a.member_code = c.member_code
//         LEFT JOIN md_employee d ON b.created_by=d.emp_id
//         JOIN td_loan e ON a.loan_id=e.loan_id
//         LEFT JOIN md_purpose f ON e.purpose = f.purp_id
//         LEFT JOIN md_sub_purpose g ON e.sub_purpose = g.sub_purp_id
//         JOIN md_scheme h ON e.scheme_id = h.scheme_id
//         LEFT JOIN md_fund i ON e.fund_id = i.fund_id`,
//         sel_fields = `a.branch_code, a.group_code, b.group_name, IF(d.emp_name != '', d.emp_name, b.created_by) co_name, f.purpose_id, g.sub_purp_name, h.scheme_name, i.fund_name, a.applied_date applied_dt, a.applied_amount applied_amt, a.disbursed_amount prn_disb_amt, a.disbursed_date disb_dt, a.current_roi curr_roi, a.installment_start_date instl_start_dt, a.period, a.period_mode, a.total_emi tot_emi, a.installment_end_date instl_end_dt, a.current_principal balance, a.overdue_principal od_balance, a.interest_amount intt_balance, (a.current_principal + a.overdue_principal + a.interest_amount) total_outstanding`,
//         sel_whr_fields = null,
//         sel_whr_arr = [],
//         sel_order = `ORDER BY a.disbursed_date`;
//         var repo_data = await db_RunProcedureAndFetchData(pro_name, pro_params, pro_params_val, sel_fields, sel_table_name, sel_whr_fields, sel_whr_arr, sel_order);
//         var groupwiseBalance = [], res_dt = [];
//         if (repo_data.suc > 0 && repo_data.msg.length > 0) {
//             var curr_group_code = '',
//             prev_group_code = '';
//             for(let dt of repo_data.msg){
//                 curr_group_code = dt.group_code;
//                 if(curr_group_code != prev_group_code){
//                     groupwiseBalance.push(dt)
//                     prev_group_code = curr_group_code
//                     var tot_balance = dt.balance, tot_od_balance = dt.od_balance, tot_intt_balance = dt.intt_balance, tot_outstanding = dt.total_outstanding,
//                     tot_applied_amt = dt.applied_amt,
//                     tot_prn_disb_amt = dt.prn_disb_amt,
//                     tot_tot_emi = dt.tot_emi; 
//                 }else{
//                     tot_balance += dt.balance;
//                     tot_od_balance += dt.od_balance;
//                     tot_intt_balance += dt.intt_balance;
//                     tot_outstanding += dt.total_outstanding;
//                     tot_applied_amt += dt.applied_amt;
//                     tot_prn_disb_amt += dt.prn_disb_amt;
//                     tot_tot_emi += dt.tot_emi;
                    
//                     var arr_index = groupwiseBalance.findIndex(x => x.group_code == curr_group_code);
//                     groupwiseBalance[arr_index].balance = tot_balance;
//                     groupwiseBalance[arr_index].od_balance = tot_od_balance;
//                     groupwiseBalance[arr_index].intt_balance = tot_intt_balance;
//                     groupwiseBalance[arr_index].total_outstanding = tot_outstanding;
//                     groupwiseBalance[arr_index].applied_amt = tot_applied_amt;
//                     groupwiseBalance[arr_index].prn_disb_amt = tot_prn_disb_amt;
//                     groupwiseBalance[arr_index].tot_emi = tot_tot_emi;
//                 }
//                 // if(!groupwiseBalance[dt.group_code]){
//                 //     groupwiseBalance[dt.group_code] = [];
//                 // }
//                 // groupwiseBalance[dt.group_code].push(dt);
//                 // if(groupwiseBalance[group_code].length > 0){
//                 // }
//             }
//         }

//         res.send({ suc: repo_data.suc, msg: repo_data.suc > 0 ? groupwiseBalance : [] });
//     } catch (error) {
//         console.error("Error fetching loan outstanding report:", error);
//         res.status(500).send({ suc: 0, msg: "An error occurred" });
//     }
// }); 

module.exports = {loan_outstandingRouter}