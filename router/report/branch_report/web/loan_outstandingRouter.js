const { db_Select, db_RunProcedureAndFetchData } = require('../../../../model/mysqlModel');
const { loan_balance_outstanding, loan_od_balance_outstanding, loan_intt_balance_outstanding, get_prn_amt, get_intt_amt } = require('../../../../modules/api/masterModule');

const express = require('express'),
loan_outstandingRouter = express.Router(),
dateFormat = require('dateformat');

// loan_outstandingRouter.post("/loan_outstanding_report_memberwise", async (req, res) => {
//     try {
//         var data = req.body;
//         const pro_name = 'p_loan_out_standing',
//         pro_params = `?,?`,
//         pro_params_val = [data.branch_code, data.os_dt],
//         sel_table_name = `tt_loan_outstanding a, md_group b, md_member c`,
//         sel_fields = `a.loan_id, a.branch_code, a.group_code, b.group_name, a.member_code, c.client_name, a.disbursed_date disb_dt, a.current_roi curr_roi, a.period, a.period_mode, a.total_emi tot_emi, a.installment_end_date instl_end_dt, a.current_principal balance, a.overdue_principal od_balance, a.interest_amount intt_balance, (a.current_principal + a.overdue_principal + a.interest_amount) total_outstanding`,
//         sel_whr_fields = `a.group_code=b.group_code AND a.member_code = c.member_code`,
//         sel_whr_arr = [],
//         sel_order = `ORDER BY a.disbursed_date`;
//         var res_dt = await db_RunProcedureAndFetchData(pro_name, pro_params, pro_params_val, sel_fields, sel_table_name, sel_whr_fields, sel_whr_arr, sel_order);
//         res.send(res_dt);
//     } catch (error) {
//         console.error("Error fetching loan outstanding report:", error);
//         res.send({ suc: 0, msg: "An error occurred" });
//     }
// });

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
//         sel_fields = `a.branch_code, a.group_code, b.group_name,f.purpose_id, g.sub_purp_name, h.scheme_name, i.fund_name, a.applied_date applied_dt, Sum(a.applied_amount) applied_amt, sum(a.disbursed_amount) prn_disb_amt, a.disbursed_date disb_dt, a.current_roi curr_roi, a.installment_start_date instl_start_dt, a.period, a.period_mode, sum(a.total_emi) tot_emi, a.installment_end_date instl_end_dt, sum(a.current_principal) balance, sum(a.overdue_principal) od_balance, sum(a.interest_amount) intt_balance, (sum(a.current_principal) + sum(a.overdue_principal) + sum(a.interest_amount)) total_outstanding`,
//         sel_whr_fields = null,
//         sel_whr_arr = [],
//         sel_order = `GROUP BY a.branch_code, a.group_code, b.group_name,f.purpose_id, g.sub_purp_name, h.scheme_name, i.fund_name, a.applied_date, a.disbursed_date, a.current_roi, a.installment_start_date, a.period, a.period_mode,a.installment_end_date
//         ORDER BY a.disbursed_date`;
//         var repo_data = await db_RunProcedureAndFetchData(pro_name, pro_params, pro_params_val, sel_fields, sel_table_name, sel_whr_fields, sel_whr_arr, sel_order);

//         res.send(repo_data)

//     } catch (error) {
//         console.error("Error fetching loan outstanding report:", error);
//         res.send({ suc: 0, msg: "An error occurred" });
//     }
// }); 


//Outstanding report groupwise 13.03.2025

    loan_outstandingRouter.post("/loan_outstanding_report_groupwise", async (req, res) => {
            try {
                var data = req.body;
                console.log(data,'datas');
                
                const currentDate = new Date();
                const supplyDate = new Date(data.supply_date);

                // Identify supply date type
                const isCurrentDate = supplyDate.toDateString() === currentDate.toDateString();
                console.log(isCurrentDate,'iscurrent');
                
        
                // Choose table based on date
                if (isCurrentDate) {
                    var select = "a.group_code,b.group_name,b.co_id,b.bank_name,b.acc_no1,b.acc_no2,SUM(a.prn_disb_amt) prn_disb_amt,SUM(a.prn_amt + a.od_prn_amt) prn_outstanding,SUM(a.intt_amt) intt_outstanding,SUM(a.outstanding) outstanding,c.emp_name co_name",
                    table_name = "td_loan a LEFT JOIN md_group b ON a.group_code = b.group_code LEFT JOIN md_employee c ON b.co_id = c.emp_id",
                    whr = `a.branch_code = '${data.branch_code}'`,
                    order = `GROUP BY a.group_code,b.group_name,b.co_id,b.bank_name,b.acc_no1,b.acc_no2,c.emp_name`;
                    var outstanding_data = await db_Select(select,table_name,whr,order);
                    res.send(outstanding_data);
                }else {
                    var select = "MAX(balance_date) balance_date",
                    table_name = "td_loan_month_balance",
                    whr = `branch_code = '${data.branch_code}' AND balance_date <= '${dateFormat(data.supply_date,'yyyy-mm-dd')}'`,
                    order = null;
                    var res_dt = await db_Select(select,table_name,whr,order);

                    if(res_dt.suc > 0 && res_dt.msg.length > 0){
                    var select = "b.group_code,c.group_name,c.co_id,c.bank_name,c.acc_no1,c.acc_no2,SUM(b.prn_disb_amt) prn_disb_amt,SUM(a.prn_amt) prn_outstanding,SUM(a.intt_amt) intt_outstanding,SUM(a.outstanding) outstanding,d.emp_name co_name",
                    table_name = "td_loan_month_balance a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_group c ON b.group_code = c.group_code LEFT JOIN md_employee d ON c.co_id = d.emp_id",
                    whr = `a.balance_date = '${dateFormat(res_dt.msg[0].balance_date,'yyyy-mm-dd')}' AND b.branch_code = '${data.branch_code}'`,
                    order = `GROUP BY b.group_code,c.group_name,c.co_id,c.bank_name,c.acc_no1,c.acc_no2,d.emp_name`;
                    var outstanding_data = await db_Select(select,table_name,whr,order);
                    res.send(outstanding_data);
                }
              }
            } catch (error) {
                console.error("Error fetching loan outstanding report:", error);
                res.send({ suc: 0, msg: "An error occurred" });
            }
        });


module.exports = {loan_outstandingRouter}