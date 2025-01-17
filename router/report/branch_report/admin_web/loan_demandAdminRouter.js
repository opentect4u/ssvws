const { db_Select, db_RunProcedureAndFetchData } = require('../../../../model/mysqlModel');
const { dayRevarseList, getLoanDmd, getLoanBal } = require('../../../../modules/api/masterModule');

const express = require('express'),
loan_demandAdminRouter = express.Router(),
dateFormat = require('dateformat');


//MEMBERWISE DEMAND REPORT IN ADMIN
loan_demandAdminRouter.post("/loan_demand_report_membwise_admin", async (req, res) => {
    try {
                var data = req.body;

                 const pro_name = 'p_loan_demand',
                 pro_params = `?,?,?`,
                 pro_params_val = [data.from_dt, data.to_dt, data.branch_code],
                 sel_table_name = `tt_loan_demand a,vw_loan_demand_report b`,
                 sel_fields = `a.loan_id,a.member_code,b.client_name,a.group_code,b.group_name,a.disbursed_date,a.disbursed_amount,a.current_roi,a.period,a.period_mode,a.recov_day,a.installment_end_date,a.total_emi,a.curr_dmd_amt demand,a.current_principal,b.co_name`,
                 sel_whr_fields = `a.loan_id = b.loan_id AND (a.curr_dmd_amt + a.current_principal) > 0`,
                 sel_whr_arr = [],
                 sel_order = `ORDER BY  a.loan_id`;
                 var loan_dt_membwise = await db_RunProcedureAndFetchData(pro_name, pro_params, pro_params_val, sel_fields, sel_table_name, sel_whr_fields, sel_whr_arr, sel_order);

                 res.send(loan_dt_membwise)

            } catch (error) {
              console.error("Error fetching demand report memberwise:", error);
              res.send({ suc: 0, msg: "An error occurred" });
          }
});


//GROUPWISE DEMAND REPORT IN ADMIN
loan_demandAdminRouter.post("/loan_demand_report_groupwise_admin", async (req, res) => {
  try {
              var data = req.body;

               const pro_name = 'p_loan_demand',
               pro_params = `?,?,?`,
               pro_params_val = [data.from_dt, data.to_dt, data.branch_code],
               sel_table_name = `tt_loan_demand a,vw_loan_demand_report b`,
               sel_fields = `a.group_code,b.group_name,a.disbursed_date,sum(a.disbursed_amount)disbursed_amount,a.current_roi,a.period,a.period_mode,a.installment_end_date,sum(a.total_emi)total_emi,sum(a.curr_dmd_amt) demand,sum(a.current_principal)outstanding,b.co_name`,
               sel_whr_fields = `a.loan_id = b.loan_id AND (a.curr_dmd_amt + a.current_principal) > 0`,
               sel_whr_arr = [],
               sel_order = `GROUP BY a.group_code,b.group_name,a.disbursed_date,a.current_roi,a.period,a.period_mode,a.installment_end_date,b.co_name`;
               var loan_dt_groupwise = await db_RunProcedureAndFetchData(pro_name, pro_params, pro_params_val, sel_fields, sel_table_name, sel_whr_fields, sel_whr_arr, sel_order);

               res.send(loan_dt_groupwise)

          } catch (error) {
            console.error("Error fetching demand report groupwise:", error);
            res.send({ suc: 0, msg: "An error occurred" });
        }
});

//COWISE DEMAND REPORT IN ADMIN
loan_demandAdminRouter.post("/loan_demand_report_cowise_admin", async (req, res) => {
    try {
        var data = req.body;
        const pro_name = 'p_loan_demand',
        pro_params = `?,?,?`,
        pro_params_val = [data.from_dt, data.to_dt, data.branch_code],
        sel_table_name = `tt_loan_demand a,vw_loan_demand_report b`,
        sel_fields = `a.loan_id,a.member_code,b.client_name,a.group_code,b.group_name,a.disbursed_date,a.disbursed_amount,a.current_roi,a.period,a.period_mode,a.recov_day,a.installment_end_date,a.total_emi,a.curr_dmd_amt demand,a.current_principal,b.co_name,b.collec_code`,
        sel_whr_fields = `a.loan_id = b.loan_id AND b.collec_code = '${data.co_id}' AND (a.curr_dmd_amt + a.current_principal) > 0`,
        sel_whr_arr = [],
        sel_order = `ORDER BY  a.loan_id`;
        var repo_data_cowise = await db_RunProcedureAndFetchData(pro_name, pro_params, pro_params_val, sel_fields, sel_table_name, sel_whr_fields, sel_whr_arr, sel_order);

        res.send(repo_data_cowise)

    } catch (error) {
        console.error("Error fetching demand vs collection report cowise:", error);
        res.send({ suc: 0, msg: "An error occurred" });
    }
});

module.exports = {loan_demandAdminRouter}