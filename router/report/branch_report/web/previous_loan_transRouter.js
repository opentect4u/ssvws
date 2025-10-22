const { db_Select } = require('../../../../model/mysqlModel');

const express = require('express'),
prev_loan_transRouter = express.Router(),
dateFormat = require('dateformat');

//fetch branch name based on user type

prev_loan_transRouter.post("/fetch_brnname_based_usertype", async (req, res) => {
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

  // previous loan transaction report groupwise

  prev_loan_transRouter.post("/prev_loan_trans_groupwise_report", async (req, res) => {
  try{
    var data = req.body;
    console.log(data,'data');

    var select = `a.payment_date,a.branch_code,b.branch_name code,c.group_code,e.group_name,h.bank_name,h.branch_name bank_branch,e.acc_no1 sb_account,e.acc_no2 loan_account,e.grp_addr,e.co_id,f.emp_name,c.scheme_id,g.scheme_name,SUM(a.debit)debit,SUM(a.credit)credit,(SUM(a.credit) - SUM(a.intt))prn_recov, SUM(a.intt)intt`,
    table_name = `(SELECT a.payment_date,a.payment_id,b.branch_code,a.loan_id,a.debit,a.credit,0 intt
                   FROM td_loan_transactions a,td_loan b
                   WHERE a.loan_id = b.loan_id
                   AND b.branch_code IN (${data.branch_code})
                   AND a.tr_type IN ('D','R')
                   AND a.payment_date BETWEEN '${data.from_dt}' AND '${data.to_dt}'

                   UNION

                   SELECT a.payment_date,a.payment_id,b.branch_code,a.loan_id,0 debit,0 credit,a.debit intt
                   FROM  sd_loan_transactions a,td_loan b
                   WHERE a.loan_id = b.loan_id
                   AND   b.branch_code IN (${data.branch_code})
                   AND   a.payment_date BETWEEN '${data.from_dt}' AND '${data.to_dt}'
                   )a,md_branch b,td_loan c,md_group e,md_employee f,md_scheme g, md_bank h`,   
    whr = `a.branch_code = b.branch_code
           AND a.loan_id     = c.loan_id
           AND c.group_code  = e.group_code
           AND e.co_id       = f.emp_id
           AND c.scheme_id   = g.scheme_id
           AND e.bank_name = h.bank_code`,
    order = `GROUP BY a.payment_date,a.branch_code,b.branch_name,c.group_code,e.group_name,h.bank_name,h.branch_name,e.acc_no1,e.acc_no2,e.grp_addr,e.co_id,f.emp_name,c.scheme_id,g.scheme_name
    ORDER BY a.payment_date`       
    var groupwise_prev_loan_transaction_report = await db_Select(select,table_name,whr,order);
    res.send(groupwise_prev_loan_transaction_report);
  }catch(error){
    res.send(error);
  }
  });

  // previous loan transaction report memberwise

  prev_loan_transRouter.post("/prev_loan_trans_memberwise_report", async (req, res) => {
    try{
        var data = req.body;

        var select = `a.payment_date,a.branch_code,b.branch_name code,a.loan_id,c.member_code,d.client_name,
       c.group_code,e.group_name,h.bank_name,h.branch_name bank_branch,e.acc_no1 sb_account,e.acc_no2 loan_account,
       e.grp_addr,e.co_id,f.emp_name,c.scheme_id,g.scheme_name,
       SUM(a.debit)debit,SUM(a.credit)credit,(SUM(a.credit) - SUM(a.intt))prn_recov, SUM(a.intt)intt`,
       table_name = `(SELECT a.payment_date,
                     a.payment_id,
                     b.branch_code,
                     a.loan_id,
                     a.debit,
                     a.credit,
                     0 intt
                     FROM  td_loan_transactions a,td_loan b
                     WHERE a.loan_id = b.loan_id
                     AND b.branch_code IN (${data.branch_code})
                     AND a.tr_type IN ('D','R')
                     AND a.payment_date BETWEEN '${data.from_dt}' AND '${data.to_dt}'

                     UNION

                     SELECT a.payment_date,a.payment_id,b.branch_code,a.loan_id,0 debit,0 credit,a.debit intt
                     FROM sd_loan_transactions a,td_loan b
                     WHERE a.loan_id = b.loan_id
                     AND b.branch_code IN (${data.branch_code})
                     AND a.payment_date BETWEEN '${data.from_dt}' AND '${data.to_dt}')a,
                     md_branch b,td_loan c,md_member d,md_group e,md_employee f,md_scheme g, md_bank h`,
        whr = `a.branch_code = b.branch_code
               AND a.loan_id = c.loan_id
               AND c.member_code = d.member_code
               AND c.group_code  = e.group_code
               AND e.co_id       = f.emp_id
               AND c.scheme_id   = g.scheme_id
               AND e.bank_name = h.bank_code`,
        order = `GROUP BY a.payment_date,a.branch_code,b.branch_name,a.loan_id,c.member_code,d.client_name,
           c.group_code,e.group_name,h.bank_name,h.branch_name,e.acc_no1,e.acc_no2,e.grp_addr,e.co_id,
           f.emp_name,c.scheme_id,g.scheme_name
           ORDER BY a.payment_date,a.loan_id`;
        var memberwise_prev_loan_transaction_report = await db_Select(select,table_name,whr,order);
        res.send(memberwise_prev_loan_transaction_report)
    }catch(error){
        res.send(error);
    }
  });

  //previous loan transaction report cowise

    prev_loan_transRouter.post("/prev_loan_trans_cowise_report", async (req, res) => {
  try{
    var data = req.body;
    console.log(data,'data');

    var select = `a.payment_date,a.branch_code,b.branch_name,c.group_code,e.group_name,h.bank_name,h.branch_name bank_branch,e.acc_no1 sb_account,e.acc_no2 loan_account,e.grp_addr,e.co_id,f.emp_name,c.scheme_id,g.scheme_name,SUM(a.debit)debit,SUM(a.credit)credit,(SUM(a.credit) - SUM(a.intt))prn_recov, SUM(a.intt)intt`,
    table_name = `(SELECT a.payment_date,a.payment_id,b.branch_code,a.loan_id,a.debit,a.credit,0 intt
                   FROM td_loan_transactions a,td_loan b
                   WHERE a.loan_id = b.loan_id
                   AND b.branch_code IN (${data.branch_code})
                   AND a.tr_type IN ('D','R')
                   AND a.payment_date BETWEEN '${data.from_dt}' AND '${data.to_dt}'

                   UNION

                   SELECT a.payment_date,a.payment_id,b.branch_code,a.loan_id,0 debit,0 credit,a.debit intt
                   FROM  sd_loan_transactions a,td_loan b
                   WHERE a.loan_id = b.loan_id
                   AND   b.branch_code IN (${data.branch_code})
                   AND   a.payment_date BETWEEN '${data.from_dt}' AND '${data.to_dt}'
                   )a,md_branch b,td_loan c,md_group e,md_employee f,md_scheme g, md_bank h`,   
    whr = `a.branch_code = b.branch_code
           AND a.loan_id     = c.loan_id
           AND c.group_code  = e.group_code
           AND e.co_id       = f.emp_id
           AND c.scheme_id   = g.scheme_id
           AND e.bank_name = h.bank_code
           AND e.co_id IN (${data.co_id})`,
    order = `GROUP BY a.payment_date,a.branch_code,b.branch_name,c.group_code,e.group_name,h.bank_name,h.branch_name,e.acc_no1,e.acc_no2,e.grp_addr,e.co_id,f.emp_name,c.scheme_id,g.scheme_name
    ORDER BY a.payment_date`       
    var cowise_prev_loan_transaction_report = await db_Select(select,table_name,whr,order);
    res.send(cowise_prev_loan_transaction_report);
  }catch(error){
    res.send(error);
  }
  });

    //previous loan transaction report fundwise

    prev_loan_transRouter.post("/prev_loan_trans_fundwise_report", async (req, res) => {
  try{
    var data = req.body;
    console.log(data,'data');

    var select = `a.payment_date,a.branch_code,b.branch_name,c.fund_id,h.fund_name,c.group_code,e.group_name,e.co_id,f.emp_name,SUM(a.debit)debit,SUM(a.credit)credit,(SUM(a.credit) - SUM(a.intt))prn_recov, SUM(a.intt)intt`,
    table_name = `(SELECT a.payment_date,a.payment_id,b.branch_code,a.loan_id,a.debit,a.credit,0 intt
                   FROM td_loan_transactions a,td_loan b
                   WHERE a.loan_id = b.loan_id
                   AND b.branch_code IN (${data.branch_code})
                   AND a.tr_type IN ('D','R')
                   AND a.payment_date BETWEEN '${data.from_dt}' AND '${data.to_dt}'

                   UNION

                   SELECT a.payment_date,a.payment_id,b.branch_code,a.loan_id,0 debit,0 credit,a.debit intt
                   FROM  sd_loan_transactions a,td_loan b
                   WHERE a.loan_id = b.loan_id
                   AND   b.branch_code IN (${data.branch_code})
                   AND   a.payment_date BETWEEN '${data.from_dt}' AND '${data.to_dt}'
                   )a,md_branch b,td_loan c,md_group e,md_employee f,md_scheme g,md_fund h`,   
    whr = `a.branch_code = b.branch_code
           AND a.loan_id     = c.loan_id
           AND c.group_code  = e.group_code
           AND e.co_id       = f.emp_id
           AND c.scheme_id   = g.scheme_id
           AND c.fund_id = h.fund_id
           AND c.fund_id IN (${data.fund_id})`,
    order = `GROUP BY a.payment_date,a.branch_code,b.branch_name,c.fund_id,h.fund_name,c.group_code,e.group_name,e.bank_name,e.branch_name,e.acc_no1,e.acc_no2,e.grp_addr,e.co_id,f.emp_name,c.scheme_id,g.scheme_name
    ORDER BY a.payment_date`       
    var fundwise_prev_loan_transaction_report = await db_Select(select,table_name,whr,order);
    res.send(fundwise_prev_loan_transaction_report);
  }catch(error){
    res.send(error);
  }
  });

    //previous loan transaction report branchwise

    prev_loan_transRouter.post("/prev_loan_trans_branchwise_report", async (req, res) => {
    try{
    var data = req.body;
    console.log(data,'data');

    var select = `a.branch_code,b.branch_name,SUM(a.debit) AS debit,SUM(a.credit) AS credit,(SUM(a.credit) - SUM(a.intt)) AS prn_recov,SUM(a.intt) AS intt_recov`,
    table_name = `(SELECT a.payment_date,
                  a.payment_id,
                  b.branch_code,
                  a.loan_id,
                  a.debit,
                  a.credit,
                  0 AS intt
                  FROM  td_loan_transactions a,td_loan b
                  WHERE a.loan_id = b.loan_id
                  AND b.branch_code IN (${data.branch_code})
                  AND a.tr_type IN ('D','R')
                  AND a.payment_date BETWEEN '${data.from_dt}' AND '${data.to_dt}'
                  
                  UNION
                  
                  SELECT a.payment_date,a.payment_id,b.branch_code,a.loan_id,0 AS debit,0 AS credit,a.debit AS intt
                  FROM  sd_loan_transactions a, td_loan b
                  WHERE a.loan_id = b.loan_id
                  AND b.branch_code IN (${data.branch_code})
                  AND a.payment_date BETWEEN '${data.from_dt}' AND '${data.to_dt}') a,md_branch b`, 
    whr = `a.branch_code = b.branch_code`,
    order = `GROUP BY a.branch_code,b.branch_name
    ORDER BY a.branch_code`;      
    var branchwise_prev_loan_transaction_report = await db_Select(select,table_name,whr,order);
    res.send(branchwise_prev_loan_transaction_report);
  }catch(error){
    res.send(error);
  }
  });

module.exports = {prev_loan_transRouter}