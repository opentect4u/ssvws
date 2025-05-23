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
    var select = "a.branch_code,a.member_code,b.group_code,a.client_name,b.loan_id,c.branch_name,d.group_name",
    table_name = "md_member a LEFT JOIN td_loan b ON a.member_code = b.member_code LEFT JOIN md_branch c ON a.branch_code = c.branch_code LEFT JOIN md_group d ON b.group_code = d.group_code",
    whr = `a.branch_code = '${data.branch_code}' AND (a.member_code like '%${data.memb}%' OR a.client_name like '%${data.memb}%')`,
    order = null;
    var member_dt = await db_Select(select,table_name,whr,order);

    res.send(member_dt);
});

loan_statementRouter.post("/loan_statement_report", async (req, res) => {
    try{
    var data = req.body;

    //FETCH LOAN STATEMENT DETAILS FOR PARTICULAR LOAN ID

    var select = `payment_date trans_date,payment_id trans_no,debit,credit,(balance + od_balance + intt_balance)total_outstanding,tr_type,IF(tr_mode = 'C', 'Cash', 'Bank Transfer')tr_mode,particulars,IF(status = 'A', 'Approved', 'Unapproved')status`,
    table_name = "td_loan_transactions",
    whr = `branch_id = '${data.branch_id}' AND date(payment_date) BETWEEN '${data.from_dt}' AND '${data.to_dt}' AND loan_id = '${data.loan_id}' AND tr_type NOT IN ('O', 'I')`,
    order = `ORDER BY payment_date,tr_type`;
    var loan_report_dt = await db_Select(select,table_name,whr,order);
    res.send(loan_report_dt);
    }catch(err){
        console.log(err);
    }
});

loan_statementRouter.post("/loan_statement_group_dtls", async (req, res) => {
    var data = req.body;

    //FETCH GROUP DETAILS
    var select = "a.branch_code,a.group_code,a.group_name,SUM(b.outstanding) outstanding,c.branch_name",
    table_name = "md_group a LEFT JOIN td_loan b ON a.group_code = b.group_code LEFT JOIN md_branch c ON a.branch_code = c.branch_code",
    whr = `a.branch_code = '${data.branch_code}' AND (a.group_code like '%${data.grp}%' OR a.group_name like '%${data.grp}%')`,
    order = `GROUP BY a.branch_code,a.group_code,a.group_name,c.branch_name`;
    var grp_dt = await db_Select(select,table_name,whr,order);

    res.send(grp_dt);
});

loan_statementRouter.post("/loan_statement_group_report", async (req, res) => {
    var data = req.body;

    //FETCH LOAN STATEMENT DETAILS FOR PARTICULAR GROUP CODE

    var select = `trans_date,debit,credit,total_outstanding,tr_type,IF(tr_mode = 'C', 'Cash', 'Bank Transfer')tr_mode,particulars,IF(status = 'A', 'Approved', 'Unapproved')status`,
    table_name = `(
        select a.payment_date trans_date,a.tr_type,a.tr_mode,a.particulars particulars,SUM(a.debit) debit,SUM(a.credit) credit,SUM(a.balance + a.od_balance +a.intt_balance) total_outstanding,a.status
        from td_loan_transactions a,td_loan b  
         where a.branch_id = '${data.branch_code}' AND a.loan_id = b.loan_id AND b.group_code = '${data.group_code}' AND date(a.payment_date) BETWEEN '${data.from_dt}' AND '${data.to_dt}' AND a.tr_type NOT IN ('O', 'I')
         GROUP BY a.payment_date,a.tr_type,a.tr_mode,a.particulars,a.status)a`,
    whr = null,
    // order = `GROUP BY trans_date,tr_type,tr_mode,particulars,status
    //          ORDER BY trans_date,tr_type`
     order = `ORDER BY trans_date,tr_type`
    var loan_report_dt = await db_Select(select,table_name,whr,order);
    res.send(loan_report_dt);
});

module.exports = {loan_statementRouter}