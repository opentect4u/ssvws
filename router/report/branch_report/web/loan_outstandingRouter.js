const { db_Select, db_RunProcedureAndFetchData, db_Insert } = require('../../../../model/mysqlModel');
const { loan_balance_outstanding, loan_od_balance_outstanding, loan_intt_balance_outstanding, get_prn_amt, get_intt_amt, getLoanBal } = require('../../../../modules/api/masterModule');

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

//fetch branch name based on user type

// loan_outstandingRouter.post("/fetch_branch_name_based_usertype", async (req, res) => {
//   try{
//      var data = req.body;
//      console.log(data,'data');
     
//      var select = "a.user_type, b.branch_assign_id, c.branch_name",
//      table_name = "md_user a LEFT JOIN td_assign_branch_user b ON a.user_type = b.user_type LEFT JOIN md_branch c ON b.branch_assign_id = c.branch_code",
//      whr = `a.emp_id = '${data.emp_id}' AND a.user_type = '${data.user_type}'`,
//      order = null;
//      var branch_dtls_user = await db_Select(select,table_name,whr,order);
//      res.send(branch_dtls_user)
//   }catch (error) {
//     console.error("Error fetching branch name details based on user type:", error);
//     res.send({ suc: 0, msg: "An error occurred" });
//             }
// });


loan_outstandingRouter.post("/fetch_branch_name_based_usertype", async (req, res) => {
    try {
      var data = req.body;
    //   console.log(data, 'data');
  
      let select = "a.user_type, b.branch_assign_id, c.branch_name";
      let table_name = "md_user a LEFT JOIN td_assign_branch_user b ON a.user_type = b.user_type LEFT JOIN md_branch c ON b.branch_assign_id = c.branch_code";
      let whr = `a.emp_id = '${data.emp_id}' AND a.user_type = '${data.user_type}'`;
      let order = null;
  
      // If user_type is 4, fetch all branches
      if (data.user_type == 4) {
        select = "branch_code AS branch_assign_id, branch_name";
        table_name = "md_branch";
        whr = `branch_code != '100'`; // This fetches all branches
      }
  
      var branch_dtls_user = await db_Select(select, table_name, whr, order);
      res.send(branch_dtls_user);
    } catch (error) {
      console.error("Error fetching branch name details based on user type:", error);
      res.send({ suc: 0, msg: "An error occurred" });
    }
  });
  


//Outstanding report groupwise 13.03.2025

    loan_outstandingRouter.post("/loan_outstanding_report_groupwise", async (req, res) => {
            try {
                var data = req.body;
                // console.log(data,'datas');
                
                const currentDate = new Date();
                const supplyDate = new Date(data.supply_date);

                // Identify supply date type
                const isCurrentDate = supplyDate.toDateString() === currentDate.toDateString();
                // console.log(isCurrentDate,'iscurrent');
                
                // Choose table based on date
                if (isCurrentDate) {
                    var select = "a.group_code,b.group_name,b.co_id,b.bank_name,b.acc_no1,b.acc_no2,a.recovery_day,SUM(a.prn_disb_amt) prn_disb_amt,SUM(a.prn_amt + a.od_prn_amt) prn_outstanding,SUM(a.intt_amt) intt_outstanding,SUM(a.outstanding) outstanding,c.emp_name co_name",
                    table_name = "td_loan a LEFT JOIN md_group b ON a.group_code = b.group_code LEFT JOIN md_employee c ON b.co_id = c.emp_id",
                    whr = `a.branch_code IN (${data.branch_code}) AND a.disb_dt <= '${data.supply_date}'`,
                    order = `GROUP BY a.group_code,b.group_name,b.co_id,b.bank_name,b.acc_no1,b.acc_no2,a.recovery_day,c.emp_name`;
                    var outstanding_data = await db_Select(select,table_name,whr,order);
                    res.send({outstanding_data,  balance_date: currentDate.toISOString().split('T')[0]});
                }else {
                    var select = "MAX(balance_date) balance_date",
                    table_name = "td_loan_month_balance",
                    whr = `branch_code IN (${data.branch_code}) AND balance_date <= '${dateFormat(data.supply_date,'yyyy-mm-dd')}'`,
                    order = null;
                    var res_dt = await db_Select(select,table_name,whr,order);

                    if(res_dt.suc > 0 && res_dt.msg.length > 0){
                        var balance_date = dateFormat(res_dt.msg[0].balance_date, 'yyyy-mm-dd');

                    var select = "b.group_code,c.group_name,c.co_id,c.bank_name,c.acc_no1,c.acc_no2,b.recovery_day,SUM(b.prn_disb_amt) prn_disb_amt,SUM(a.prn_amt) prn_outstanding,SUM(a.intt_amt) intt_outstanding,SUM(a.outstanding) outstanding,d.emp_name co_name",
                    table_name = "td_loan_month_balance a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_group c ON b.group_code = c.group_code LEFT JOIN md_employee d ON c.co_id = d.emp_id",
                    whr = `a.balance_date = '${balance_date}' AND a.branch_code IN (${data.branch_code})`,
                    order = `GROUP BY b.group_code,c.group_name,c.co_id,c.bank_name,c.acc_no1,c.acc_no2,b.recovery_day,d.emp_name`;
                    var outstanding_data = await db_Select(select,table_name,whr,order);
                    // outstanding_data['balance_date'] = balance_date
                    res.send({outstanding_data,balance_date});
                }
              }
            } catch (error) {
                console.error("Error fetching loan outstanding report:", error);
                res.send({ suc: 0, msg: "An error occurred" });
            }
        });

     //Outstanding report fundwise 13.03.2025
     
     loan_outstandingRouter.post("/loan_outstanding_report_fundwise", async (req, res) => {
        try {
            var data = req.body;
            // console.log(data,'datas');
            
            const currentDate = new Date();
            const supplyDate = new Date(data.supply_date);

            // Identify supply date type
            const isCurrentDate = supplyDate.toDateString() === currentDate.toDateString();
            // console.log(isCurrentDate,'iscurrent');
            
    
            // Choose table based on date
            if (isCurrentDate) {
                var select = "a.group_code,c.group_name,a.fund_id,b.fund_name,SUM(a.prn_disb_amt) prn_disb_amt,SUM(a.prn_amt + a.od_prn_amt) prn_outstanding,SUM(a.intt_amt) intt_outstanding,SUM(a.outstanding) outstanding",
                table_name = "td_loan a LEFT JOIN md_fund b ON a.fund_id = b.fund_id LEFT JOIN md_group c ON a.group_code = c.group_code",
                whr = `a.branch_code IN (${data.branch_code}) AND a.disb_dt <= '${data.supply_date}' AND a.fund_id = '${data.fund_id}'`,
                order = `GROUP BY a.group_code,c.group_name,a.fund_id,b.fund_name`;
                var outstanding_fund_data = await db_Select(select,table_name,whr,order);
                res.send({outstanding_fund_data,  balance_date: currentDate.toISOString().split('T')[0]});
            }else {
                var select = "MAX(balance_date) balance_date",
                table_name = "td_loan_month_balance",
                whr = `branch_code IN (${data.branch_code}) AND balance_date <= '${dateFormat(data.supply_date,'yyyy-mm-dd')}'`,
                order = null;
                var res_dt = await db_Select(select,table_name,whr,order);

                if(res_dt.suc > 0 && res_dt.msg.length > 0){
                    var balance_date = dateFormat(res_dt.msg[0].balance_date, 'yyyy-mm-dd');

                var select = "b.group_code,d.group_name,b.fund_id,c.fund_name,SUM(b.prn_disb_amt) prn_disb_amt,SUM(a.prn_amt) prn_outstanding,SUM(a.intt_amt) intt_outstanding,SUM(a.outstanding) outstanding",
                table_name = "td_loan_month_balance a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_fund c ON b.fund_id = c.fund_id LEFT JOIN md_group d ON b.group_code = d.group_code",
                whr = `a.balance_date = '${balance_date}' AND a.branch_code IN (${data.branch_code}) AND b.fund_id = '${data.fund_id}'`,
                order = `GROUP BY b.group_code,d.group_name,b.fund_id,c.fund_name`;
                var outstanding_fund_data = await db_Select(select,table_name,whr,order);
                // outstanding_fund_data['balance_date'] = balance_date
                res.send({outstanding_fund_data,balance_date});
            }
          }
        } catch (error) {
            console.error("Error fetching loan outstanding report:", error);
            res.send({ suc: 0, msg: "An error occurred" });
        }
    });

    //Fetch branchwise CO 17.03.2025

    loan_outstandingRouter.post("/fetch_brn_co", async (req, res) => {
        var data = req.body;
    
         //FETCH BRANCHWISE CO NAME
        // var select = "a.emp_id,a.emp_name,b.user_type",
        // table_name = "md_employee a LEFT JOIN md_user b ON a.emp_id = b.emp_id",
        // whr = `a.branch_id = '${data.branch_code}' AND b.user_type = '1' AND b.user_status = 'A'`,
        // order = null;
        // var branch_co = await db_Select(select,table_name,whr,order);

        var select = "DISTINCT a.co_id,ifnull(b.emp_name,'NA')emp_name",
        table_name = "md_group a LEFT JOIN md_employee b ON a.co_id = b.emp_id",
        whr = `a.branch_code IN (${data.branch_code})`,
        order = null;
        var branch_co = await db_Select(select,table_name,whr,order);
    
        res.send(branch_co)
    });


    //Outstanding report cowise 13.03.2025
     
    loan_outstandingRouter.post("/loan_outstanding_report_cowise", async (req, res) => {
        try {
                var data = req.body;
                // console.log(data,'datas_co');
                
                const currentDate = new Date();
                const supplyDate = new Date(data.supply_date);
    
                // Identify supply date type
                const isCurrentDate = supplyDate.toDateString() === currentDate.toDateString();
                // console.log(isCurrentDate,'iscurrent_co');
                
        
                // Choose table based on date
                if (isCurrentDate) {
                    var select = "a.group_code,b.group_name,b.co_id,SUM(a.prn_disb_amt) prn_disb_amt,SUM(a.prn_amt + a.od_prn_amt) prn_outstanding,SUM(a.intt_amt) intt_outstanding,SUM(a.outstanding) outstanding,c.emp_name co_name",
                    table_name = "td_loan a LEFT JOIN md_group b ON a.group_code = b.group_code LEFT JOIN md_employee c ON b.co_id = c.emp_id",
                    whr = `a.branch_code IN (${data.branch_code}) AND a.disb_dt <= '${data.supply_date}' AND b.co_id = '${data.co_id}'`,
                    order = `GROUP BY a.group_code,b.group_name,b.co_id,c.emp_name`;
                    var outstanding_co_data = await db_Select(select,table_name,whr,order);
                    res.send({outstanding_co_data,  balance_date: currentDate.toISOString().split('T')[0]});
                }else {
                    var select = "MAX(balance_date) balance_date",
                    table_name = "td_loan_month_balance",
                    whr = `branch_code IN (${data.branch_code}) AND balance_date <= '${dateFormat(data.supply_date,'yyyy-mm-dd')}'`,
                    order = null;
                    var res_dt = await db_Select(select,table_name,whr,order);
    
                    if(res_dt.suc > 0 && res_dt.msg.length > 0){
                        var balance_date = dateFormat(res_dt.msg[0].balance_date, 'yyyy-mm-dd');
    
                        var select = "b.group_code,c.group_name,c.co_id,SUM(b.prn_disb_amt) prn_disb_amt,SUM(a.prn_amt) prn_outstanding,SUM(a.intt_amt) intt_outstanding,SUM(a.outstanding) outstanding,d.emp_name co_name",
                        table_name = "td_loan_month_balance a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_group c ON b.group_code = c.group_code LEFT JOIN md_employee d ON c.co_id = d.emp_id",
                        whr = `a.balance_date = '${balance_date}' AND a.branch_code IN (${data.branch_code}) AND c.co_id = '${data.co_id}'`,
                        order = `GROUP BY b.group_code,c.group_name,c.co_id,d.emp_name`;
                    var outstanding_co_data = await db_Select(select,table_name,whr,order);
                    // outstanding_co_data['balance_date'] = balance_date
                    res.send({outstanding_co_data,balance_date});
                }
              }
            } catch (error) {
                console.error("Error fetching loan outstanding report:", error);
                res.send({ suc: 0, msg: "An error occurred" });
            }
        });

    
    //Outstanding report branchwise 13.03.2025
    
    loan_outstandingRouter.post("/loan_outstanding_report_branchwise", async (req, res) => {
        try {
                var data = req.body;
                // console.log(data,'datas_brn');
                
                const currentDate = new Date();
                const supplyDate = new Date(data.supply_date);
    
                // Identify supply date type
                const isCurrentDate = supplyDate.toDateString() === currentDate.toDateString();
                // console.log(isCurrentDate,'iscurrent_brn');
                
        
                // Choose table based on date
                if (isCurrentDate) {
                    var select = "a.branch_code,b.branch_name,SUM(a.prn_disb_amt) prn_disb_amt,SUM(a.prn_amt + a.od_prn_amt) prn_outstanding,SUM(a.intt_amt) intt_outstanding,SUM(a.outstanding) outstanding",
                    table_name = "td_loan a LEFT JOIN md_branch b ON a.branch_code = b.branch_code",
                    whr = `a.branch_code = '${data.branch_code}' AND a.disb_dt <= '${data.supply_date}'`,
                    order = `GROUP BY a.branch_code,b.branch_name`;
                    var outstanding_branch_data = await db_Select(select,table_name,whr,order);
                    res.send({outstanding_branch_data,  balance_date: currentDate.toISOString().split('T')[0]});
                }else {
                    var select = "MAX(balance_date) balance_date",
                    table_name = "td_loan_month_balance",
                    whr = `branch_code = '${data.branch_code}' AND balance_date <= '${dateFormat(data.supply_date,'yyyy-mm-dd')}'`,
                    order = null;
                    var res_dt = await db_Select(select,table_name,whr,order);
    
                    if(res_dt.suc > 0 && res_dt.msg.length > 0){
                        var balance_date = dateFormat(res_dt.msg[0].balance_date, 'yyyy-mm-dd');
    
                        var select = "a.branch_code,c.branch_name,SUM(b.prn_disb_amt) prn_disb_amt,SUM(a.prn_amt) prn_outstanding,SUM(a.intt_amt) intt_outstanding,SUM(a.outstanding) outstanding",
                        table_name = "td_loan_month_balance a LEFT JOIN td_loan b ON a.branch_code = b.branch_code AND a.loan_id = b.loan_id LEFT JOIN md_branch c ON a.branch_code = c.branch_code",
                        whr = `a.balance_date = '${balance_date}' AND a.branch_code = '${data.branch_code}'`,
                        order = `GROUP BY a.branch_code,c.branch_name`;
                    var outstanding_branch_data = await db_Select(select,table_name,whr,order);
                    // outstanding_branch_data['balance_date'] = balance_date
                    res.send({outstanding_branch_data,balance_date});
                }
              }
            } catch (error) {
                console.error("Error fetching loan outstanding report:", error);
                res.send({ suc: 0, msg: "An error occurred" });
            }
        });


    //Outstanding report memberwise 17.03.2025    

    loan_outstandingRouter.post("/loan_outstanding_report_memberwise", async (req, res) => {
        try {
            var data = req.body;
            // console.log(data,'datas_member');
            
            const currentDate = new Date();
            const supplyDate = new Date(data.supply_date);

            // Identify supply date type
            const isCurrentDate = supplyDate.toDateString() === currentDate.toDateString();
            // console.log(isCurrentDate,'iscurrent_member');
            
    
            // Choose table based on date
            if (isCurrentDate) {
                var select = "a.loan_id,c.form_no,a.member_code,b.client_name,b.client_mobile,TIMESTAMPDIFF(YEAR, b.dob, CURDATE()) AS age,b.dob,b.gurd_name,b.husband_name,b.client_addr,b.voter_id,b.pan_no,b.aadhar_no,b.nominee_name,d.group_code,d.group_name,d.co_id,d.bank_name,d.acc_no1,d.acc_no2,e.emp_name co_name,a.fund_id,f.fund_name,a.scheme_id,g.scheme_name,a.purpose,h.purpose_id,a.applied_dt,a.applied_amt,a.disb_dt loan_date,a.prn_disb_amt loan_amount,a.curr_roi,a.recovery_day,(a.prn_amt + a.od_prn_amt) prn_outstanding,a.intt_amt intt_outstanding,a.outstanding outstanding",
                table_name = "td_loan a LEFT JOIN md_member b ON a.member_code = b.member_code LEFT JOIN td_grt_basic c ON b.member_code = c.member_code LEFT JOIN md_group d ON a.group_code = d.group_code LEFT JOIN md_employee e ON d.co_id = e.emp_id LEFT JOIN md_fund f ON a.fund_id = f.fund_id LEFT JOIN md_scheme g ON a.scheme_id = g.scheme_id LEFT JOIN md_purpose h ON a.purpose = h.purp_id",
                whr = `a.branch_code IN (${data.branch_code}) AND a.disb_dt <= '${data.supply_date}'`,
                order = `ORDER BY a.member_code desc`;
                var outstanding_member_data = await db_Select(select,table_name,whr,order);
                res.send({outstanding_member_data,  balance_date: currentDate.toISOString().split('T')[0]});
            }else {
                var select = "MAX(balance_date) balance_date",
                table_name = "td_loan_month_balance",
                whr = `branch_code IN (${data.branch_code}) AND balance_date <= '${dateFormat(data.supply_date,'yyyy-mm-dd')}'`,
                order = null;
                var res_dt = await db_Select(select,table_name,whr,order);

                if(res_dt.suc > 0 && res_dt.msg.length > 0){
                    var balance_date = dateFormat(res_dt.msg[0].balance_date, 'yyyy-mm-dd');

                    var select = "a.loan_id,d.form_no,c.member_code,c.client_name,c.client_mobile,c.dob, TIMESTAMPDIFF(YEAR, c.dob, CURDATE()) AS age,c.gurd_name,c.husband_name,c.client_addr,c.voter_id,c.pan_no,c.aadhar_no,c.nominee_name,e.group_code,e.group_name,e.co_id,e.bank_name,e.acc_no1,e.acc_no2,f.emp_name co_name,b.fund_id,g.fund_name,b.scheme_id,h.scheme_name,b.purpose,i.purpose_id,b.applied_dt,b.applied_amt,b.disb_dt loan_date,b.prn_disb_amt loan_amount,b.curr_roi,b.recovery_day,a.prn_amt prn_outstanding,a.intt_amt intt_outstanding,a.outstanding outstanding",
                    table_name = "td_loan_month_balance a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_member c ON b.member_code = c.member_code LEFT JOIN td_grt_basic d ON b.member_code = d.member_code LEFT JOIN md_group e ON b.group_code = e.group_code LEFT JOIN md_employee f ON e.co_id = f.emp_id LEFT JOIN md_fund g ON b.fund_id = g.fund_id LEFT JOIN md_scheme h ON b.scheme_id = h.scheme_id LEFT JOIN md_purpose i ON b.purpose = i.purp_id",
                    whr = `a.balance_date = '${balance_date}' AND a.branch_code IN (${data.branch_code})`,
                    order = `ORDER BY c.member_code desc`;
                var outstanding_member_data = await db_Select(select,table_name,whr,order);
                // outstanding_member_data['balance_date'] = balance_date
                res.send({outstanding_member_data,balance_date});
            }
          }
        } catch (error) {
            console.error("Error fetching loan outstanding report:", error);
            res.send({ suc: 0, msg: "An error occurred" });
        }
    });

module.exports = {loan_outstandingRouter}