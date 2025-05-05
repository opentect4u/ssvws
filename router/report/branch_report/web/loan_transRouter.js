const { db_Select } = require('../../../../model/mysqlModel');

const express = require('express'),
loan_transRouter = express.Router(),
dateFormat = require('dateformat');

// loan_transRouter.post("/disb_loan_trans_report", async (req, res) => {
//     var data = req.body;

//       //FETCH DISBURSEMENT DETAILS GROUP WISE
//       if(data.flag == 'M'){
//         var select = "c.payment_date,a.group_code,d.group_name,a.member_code,b.client_name,a.loan_id,b.client_mobile,b.gurd_name,b.client_addr,b.aadhar_no,b.pan_no,b.acc_no,e.purpose_id,f.sub_purp_name,g.scheme_name,h.fund_name,a.applied_dt,a.applied_amt,a.disb_dt,a.intt_cal_amt intt_payable,a.prn_disb_amt,a.curr_roi,a.period_mode,a.instl_end_dt,(a.prn_amt + a.od_prn_amt)prn_amt,a.intt_amt,a.outstanding,c.created_by collector_code,i.emp_name collec_name,c.created_at,c.approved_by approve_code,i.emp_name approved_by,c.approved_at",
//         table_name = "td_loan a LEFT JOIN md_member b ON a.member_code = b.member_code LEFT JOIN td_loan_transactions c ON a.loan_id = c.loan_id LEFT JOIN md_group d ON a.group_code = d.group_code LEFT JOIN md_purpose e ON a.purpose = e.purp_id LEFT JOIN md_sub_purpose f ON a.sub_purpose = f.sub_purp_id LEFT JOIN md_scheme g ON a.scheme_id = g.scheme_id LEFT JOIN md_fund h ON a.fund_id = h.fund_id LEFT JOIN md_employee i ON c.created_by = i.emp_id AND c.approved_by = i.emp_id",
//         whr = `a.branch_code = '${data.branch_code}'
//         AND date(c.payment_date) BETWEEN '${data.from_dt}' AND '${data.to_dt}' AND c.tr_type = '${data.tr_type}'`,
//         order = `ORDER BY c.payment_date`;
//         var disb_loan_dt = await db_Select(select,table_name,whr,order);
    
//         res.send(disb_loan_dt);
//       }else {

//         var select = "c.payment_date,a.group_code,d.group_name, e.purpose_id,f.sub_purp_name,g.scheme_name,h.fund_name,a.applied_dt,sum(a.applied_amt)applied_amt,a.disb_dt,sum(a.intt_cal_amt)intt_payable,sum(a.prn_disb_amt)prn_disb_amt,a.curr_roi,a.period_mode,a.instl_end_dt,(sum(a.prn_amt) + sum(a.od_prn_amt))prn_amt,sum(a.intt_amt)intt_amt,sum(a.outstanding)outstanding,c.created_by collector_code,i.emp_name collec_name,c.approved_by approve_code,i.emp_name approved_by",
//         table_name = "td_loan a LEFT JOIN md_member b ON a.member_code = b.member_code LEFT JOIN td_loan_transactions c ON a.loan_id = c.loan_id LEFT JOIN md_group d ON a.group_code = d.group_code LEFT JOIN md_purpose e ON a.purpose = e.purp_id LEFT JOIN md_sub_purpose f ON a.sub_purpose = f.sub_purp_id LEFT JOIN md_scheme g ON a.scheme_id = g.scheme_id LEFT JOIN md_fund h ON a.fund_id = h.fund_id LEFT JOIN md_employee i ON c.created_by = i.emp_id AND c.approved_by = i.emp_id",
//         whr = `a.branch_code = '${data.branch_code}' AND date(c.payment_date) BETWEEN '${data.from_dt}' AND '${data.to_dt}' AND c.tr_type = '${data.tr_type}'`,
//         order = `GROUP BY c.payment_date,a.group_code,d.group_name,e.purpose_id,f.sub_purp_name,g. scheme_name,h.fund_name,a.applied_dt, a.disb_dt,a.curr_roi,a.period_mode,a.instl_end_dt,c.   created_by, i.emp_name,c.approved_by
//          ORDER BY c.payment_date`;
//         var disb_loan_dt = await db_Select(select,table_name,whr,order);
    
//         res.send(disb_loan_dt);
//       }
      
// });

// loan_transRouter.post("/recov_loan_trans_report", async (req, res) => {
//     var data = req.body;

//       //FETCH RECOVERY DETAILS GROUP WISE
//       if(data.flag == 'M'){

//       var select = "a.payment_date,a.payment_id,b.group_code,c.group_name,b.member_code,d.client_name,b.loan_id,a.particulars,a.credit,(a.balance + a.od_balance + a.intt_balance)balance,a.tr_mode,a.bank_name,a.cheque_id,a.trn_addr,a.created_by collector_code,f.emp_name collec_name,a.created_at,a.approved_by approve_code,f.emp_name approved_by,a.approved_at",
//       table_name = "td_loan_transactions a JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_group c ON b.group_code = c.group_code LEFT JOIN md_member d ON b.member_code = d.member_code LEFT JOIN md_employee f ON a.created_by = f.emp_id AND a.approved_by = f.emp_id",
//       whr = `b.branch_code = '${data.branch_code}' AND date(a.payment_date) BETWEEN '${data.from_dt}' AND '${data.to_dt}' AND a.tr_type = '${data.tr_type}'`,
//       order = `ORDER BY a.payment_date,c.group_name`;
//       var member_dt = await db_Select(select,table_name,whr,order);
  
//       res.send(member_dt);
//       } else {

//         var select = "a.payment_date,b.group_code,c.group_name,a.particulars,sum(a.credit)credit,(sum(a.balance) + sum(a.od_balance) + sum(a.intt_balance))balance,a.tr_mode,a.bank_name,a.created_by collector_code,f.emp_name collec_name,a.created_at,a.approved_by approve_code,f.emp_name approved_by",
//         table_name = "td_loan_transactions a JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_group c ON b.group_code = c.group_code LEFT JOIN md_member d ON b.member_code = d.member_code LEFT JOIN md_employee f ON a.created_by = f.emp_id AND a.approved_by = f.emp_id",
//         whr = `b.branch_code = '${data.branch_code}' AND date(a.payment_date) BETWEEN '${data.from_dt}' AND '${data.to_dt}' AND a.tr_type = '${data.tr_type}'`,
//         order = `GROUP BY a.payment_date,b.group_code,c.group_name,a.particulars,a.tr_mode,a.bank_name,a.created_by,f.emp_name,a.created_at,a.approved_by
//         ORDER BY a.payment_date,c.group_name`;
//         var member_dt = await db_Select(select,table_name,whr,order);
  
//       res.send(member_dt);
//       }
// });

//fetch branch name based on user type

loan_transRouter.post("/fetch_brnname_based_usertype", async (req, res) => {
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

// Transaction report groupwise 13.03.2025

loan_transRouter.post("/transaction_report_groupwise", async (req, res) => {
  try{
    var data = req.body;
 
    var select = `b.branch_code,e.branch_name,a.payment_date,b.group_code,c.group_name,c.acc_no1,c.acc_no2,c.grp_addr,c.co_id,d.emp_name co_name,
      ${data.tr_type === 'D' ? 'SUM(a.debit) AS debit' : 'SUM(a.credit) AS credit'},SUM(b.prn_amt + b.od_prn_amt + b.intt_amt)curr_balance`
    table_name = "td_loan_transactions a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_group c ON  b.group_code = c.group_code LEFT JOIN md_employee d ON c.co_id = d.emp_id LEFT JOIN md_branch e ON b.branch_code = e.branch_code",
    whr = `a.branch_id IN (${data.branch_code}) AND a.payment_date BETWEEN '${data.from_dt}' AND '${data.to_dt}'
           AND a.tr_type = '${data.tr_type}'`,
    order = `GROUP BY b.branch_code,e.branch_name,a.payment_date,b.group_code,c.group_name,c.acc_no1,c.acc_no2,c.grp_addr,c.co_id,d.emp_name
             ORDER BY a.payment_date`;
    var transaction_group_data = await db_Select(select,table_name,whr,order);
    res.send({transaction_group_data})
  }catch (error){
   console.error("Error fetching transaction report groupwise:", error);
   res.send({ suc: 0, msg: "An error occurred" });
  }
 });

// Transaction report fundwise 17.03.2025

loan_transRouter.post("/transaction_report_fundwise", async (req, res) => {
  try{
    var data = req.body;
 
    var select = `b.branch_code,f.branch_name,a.payment_date,b.group_code,c.group_name,b.fund_id,e.fund_name,c.acc_no1,c.acc_no2,c.grp_addr,c.co_id,d.emp_name co_name,${data.tr_type === 'D' ? 'SUM(a.debit) AS debit' : 'SUM(a.credit) AS credit'},SUM(b.prn_amt + b.od_prn_amt + b.intt_amt)curr_balance`,
    table_name = "td_loan_transactions a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_group c ON  b.group_code = c.group_code LEFT JOIN md_employee d ON c.co_id = d.emp_id LEFT JOIN md_fund e ON b.fund_id = e.fund_id LEFT JOIN md_branch f ON b.branch_code = f.branch_code",
    whr = `a.branch_id IN (${data.branch_code}) AND a.payment_date BETWEEN '${data.from_dt}' AND '${data.to_dt}'
           AND b.fund_id IN (${data.fund_id}) AND a.tr_type = '${data.tr_type}'`,
    order = `GROUP BY b.branch_code,f.branch_name,a.payment_date,b.group_code,c.group_name,b.fund_id,e.fund_name,c.acc_no1,c.acc_no2,c.grp_addr,c.co_id,d.emp_name
             ORDER BY a.payment_date`;
    var transaction_fund_data = await db_Select(select,table_name,whr,order);
    res.send({transaction_fund_data})
  }catch (error){
   console.error("Error fetching transaction report fundwise:", error);
   res.send({ suc: 0, msg: "An error occurred" });
  }
 });

// Transaction report cowise 17.03.2025

loan_transRouter.post("/transaction_report_cowise", async (req, res) => {
  try{
    var data = req.body;
 
    var select = `b.branch_code,f.branch_name,a.payment_date,c.co_id,d.emp_name co_name,COUNT(DISTINCT c.group_code) AS total_group,COUNT(b.member_code) AS total_member,b.fund_id,e.fund_name,${data.tr_type === 'D' ? 'SUM(a.debit) AS debit' : 'SUM(a.credit) AS credit'},SUM(b.prn_amt + b.od_prn_amt + b.intt_amt)curr_balance`,
    table_name = "td_loan_transactions a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_group c ON b.group_code = c.group_code LEFT JOIN md_employee d ON c.co_id = d.emp_id LEFT JOIN md_fund e ON b.fund_id = e.fund_id LEFT JOIN md_branch f ON b.branch_code = f.branch_code",
    whr = `a.branch_id IN (${data.branch_code}) AND a.payment_date BETWEEN '${data.from_dt}' AND '${data.to_dt}'
           AND c.co_id IN (${data.co_id}) AND a.tr_type = '${data.tr_type}'`,
    order = `GROUP BY b.branch_code,f.branch_name,a.payment_date,c.co_id,d.emp_name,b.fund_id,e.fund_name
             ORDER BY a.payment_date`;
    var transaction_co_data = await db_Select(select,table_name,whr,order);
    res.send({transaction_co_data})
  }catch (error){
   console.error("Error fetching transaction report cowise:", error);
   res.send({ suc: 0, msg: "An error occurred" });
  }
 });

  // Transaction report memberwise 17.03.2025

  loan_transRouter.post("/transaction_report_memberwise", async (req, res) => {
    try{
      var data = req.body;
   
      var select = `b.branch_code,i.branch_name,a.payment_date,b.group_code,c.group_name,c.acc_no1,c.acc_no2,c.grp_addr,c.co_id,d.emp_name,b.loan_id,b.member_code,e.client_name,b.scheme_id,f.scheme_name,a.payment_id transaction_id,a.payment_date transaction_date,a.particulars,${data.tr_type === 'D' ? 'a.debit AS debit' : 'a.credit AS credit'},(b.prn_amt + b.od_prn_amt + b.intt_amt)curr_balance,a.created_by created_code,a.created_at,g.emp_name created_by,a.approved_at,a.approved_by approved_code,h.emp_name approved_by`,
      table_name = "td_loan_transactions a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_group c ON b.group_code = c.group_code LEFT JOIN md_employee d ON c.co_id = d.emp_id LEFT JOIN md_member e ON b.member_code = e.member_code LEFT JOIN md_scheme f ON b.scheme_id = f.scheme_id LEFT JOIN md_employee g ON a.created_by = g.emp_id LEFT JOIN md_employee h ON a.approved_by = h.emp_id LEFT JOIN md_branch i ON b.branch_code = i.branch_code",
      whr = `a.branch_id IN (${data.branch_code}) AND a.payment_date BETWEEN '${data.from_dt}' AND '${data.to_dt}' AND a.tr_type = '${data.tr_type}'`,
      order = `ORDER BY a.payment_date`;
      var transaction_member_data = await db_Select(select,table_name,whr,order);
      res.send({transaction_member_data})
    }catch (error){
     console.error("Error fetching transaction report memberwise:", error);
     res.send({ suc: 0, msg: "An error occurred" });
    }
   });


   // Transaction report branchwise 26.03.2025

  loan_transRouter.post("/transaction_report_branchwise", async (req, res) => {
    try{
      var data = req.body;
   
      var select = `a.branch_id,c.branch_name,${data.tr_type === 'D' ? 'SUM(a.debit) AS debit' : 'SUM(a.credit) AS credit'},SUM(b.prn_amt + b.od_prn_amt + b.intt_amt)curr_balance`,
      table_name = "td_loan_transactions a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_branch c ON a.branch_id = c.branch_code",
      whr = `a.branch_id IN (${data.branch_code}) AND a.payment_date BETWEEN '${data.from_dt}' AND '${data.to_dt}' AND a.tr_type = '${data.tr_type}'`,
      order = `GROUP BY a.branch_id,c.branch_name`;
      var transaction_branch_data = await db_Select(select,table_name,whr,order);
      res.send({transaction_branch_data})
    }catch (error){
     console.error("Error fetching transaction report branchwise:", error);
     res.send({ suc: 0, msg: "An error occurred" });
    }
   });

module.exports = {loan_transRouter}