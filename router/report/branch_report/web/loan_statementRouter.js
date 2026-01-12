const { db_Select } = require('../../../../model/mysqlModel');

const express = require('express'),
loan_statementRouter = express.Router(),
dateFormat = require('dateformat');

//fetch branch name based on user type
loan_statementRouter.post("/fetch_brn_name_based_usertype", async (req, res) => {
    try {
      var data = req.body;
  
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

loan_statementRouter.post("/loan_statement_memb_dtls", async (req, res) => {
    var data = req.body;
    
    //FETCH MEMBER DETAILS
    var select = "a.branch_code,a.member_code,b.group_code,a.client_name,b.loan_id,c.branch_name,c.area_code,d.group_name",
    table_name = "md_member a LEFT JOIN td_loan b ON a.member_code = b.member_code LEFT JOIN md_branch c ON a.branch_code = c.branch_code LEFT JOIN md_group d ON b.group_code = d.group_code",
    whr = `a.branch_code IN (${data.branch_code}) AND (a.member_code like '%${data.memb}%' OR a.client_name like '%${data.memb}%')`,
    order = null;
    var member_dt = await db_Select(select,table_name,whr,order);

    res.send(member_dt);
});

loan_statementRouter.post("/loan_statement_report", async (req, res) => {
    try{
    var data = req.body;

    //FETCH LOAN STATEMENT DETAILS FOR PARTICULAR LOAN ID

    var select = `a.loan_id,b.member_code,b.group_code,b.branch_code,c.client_name,date(a.payment_date) trans_date,a.payment_id trans_no,a.debit,a.credit,a.balance,a.intt_balance,(a.balance + a.od_balance + a.intt_balance)total_outstanding,a.tr_type,IF(a.tr_mode = 'C', 'Cash', 'Bank Transfer')tr_mode,a.particulars,a.created_by,a.created_at,a.approved_by,a.approved_at,IF(a.status = 'A', 'Approved', 'Unapproved')STATUS`,
    table_name = "td_loan_transactions a,td_loan b,md_member c",
    whr = `a.loan_id = b.loan_id
           AND b.member_code = c.member_code
           AND a.payment_date BETWEEN '${data.from_dt}' AND '${data.to_dt}' 
           AND a.loan_id = '${data.loan_id}' 
           AND a.tr_type NOT IN ('O', 'I')`,
    order = `ORDER BY a.payment_date,a.tr_type,a.payment_id`;
    var loan_report_dt = await db_Select(select,table_name,whr,order);
    res.send(loan_report_dt);
    }catch(err){
        console.log(err);
    }
});

loan_statementRouter.post("/loan_statement_group_dtls", async (req, res) => {
    var data = req.body;

    //FETCH GROUP DETAILS
    var select = "a.branch_code,a.group_code,a.group_name,SUM(b.outstanding) outstanding,c.branch_name,c.area_code",
    table_name = "md_group a LEFT JOIN td_loan b ON a.group_code = b.group_code LEFT JOIN md_branch c ON a.branch_code = c.branch_code",
    whr = `a.branch_code IN (${data.branch_code}) AND (a.group_code like '%${data.grp}%' OR a.group_name like '%${data.grp}%')`,
    order = `GROUP BY a.branch_code,a.group_code,a.group_name,c.branch_name,c.area_code`;
    var grp_dt = await db_Select(select,table_name,whr,order);

    res.send(grp_dt);
});

loan_statementRouter.post("/loan_statement_group_report", async (req, res) => {
    var data = req.body;

    //FETCH LOAN STATEMENT DETAILS FOR PARTICULAR GROUP CODE

    var select = `a.loan_id,b.member_code,b.group_code,b.branch_code,c.client_name,date(a.payment_date) trans_date,a.payment_id trans_no,a.debit,a.credit,a.balance,a.intt_balance,(a.balance + a.od_balance + a.intt_balance)total_outstanding,a.tr_type,IF(a.tr_mode = 'C', 'Cash', 'Bank Transfer')tr_mode,a.particulars,a.created_by,a.created_at,a.approved_by,a.approved_at,IF(a.status = 'A', 'Approved', 'Unapproved')STATUS`,
    table_name = "td_loan_transactions a,td_loan b,md_member c", 
    whr = `a.loan_id = b.loan_id
           AND b.member_code = c.member_code
           AND b.group_code = '${data.group_code}'
           AND a.payment_date BETWEEN '${data.from_dt}' AND '${data.to_dt}'
           AND a.tr_type NOT IN ('O', 'I')`,
     order = `ORDER BY a.loan_id,a.payment_date,a.tr_type,a.payment_id`
    var loan_report_dt = await db_Select(select,table_name,whr,order);
    res.send(loan_report_dt);
});

module.exports = {loan_statementRouter}