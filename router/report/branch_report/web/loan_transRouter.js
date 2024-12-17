const { db_Select } = require('../../../../model/mysqlModel');

const express = require('express'),
loan_transRouter = express.Router(),
dateFormat = require('dateformat');

loan_transRouter.post("/disb_loan_trans_report", async (req, res) => {
    var data = req.body;

      //FETCH DISBURSEMENT DETAILS GROUP WISE
      var select = "a.payment_date trans_dt,a.payment_id trans_id,a.debit,a.bank_charge,a.proc_charge,a.balance,a.created_by,a.created_at,a.trn_addr,b.group_code,c.group_name",
      table_name = "td_loan_transactions a, td_loan b, md_group c",
      whr = `a.branch_id = b.branch_code
      AND a.loan_id = b.loan_id
      AND b.branch_code = c.branch_code
      AND b.group_code = c.group_code
      AND date(a.payment_date) BETWEEN '${data.from_dt}' AND '${data.to_dt}' AND a.tr_type = '${data.tr_type}'`,
      order = null;
      var disb_loan_dt = await db_Select(select,table_name,whr,order);
  
      res.send(disb_loan_dt);
});

loan_transRouter.post("/recov_loan_trans_report", async (req, res) => {
    var data = req.body;

      //FETCH RECOVERY DETAILS GROUP WISE
      var select = "a.payment_date trans_dt,a.payment_id trans_id,a.credit,a.balance,a.created_by,a.created_at,a.trn_addr,b.group_code,c.group_name",
      table_name = "td_loan_transactions a, td_loan b, md_group c",
      whr = `a.branch_id = b.branch_code
      AND a.loan_id = b.loan_id
      AND b.branch_code = c.branch_code
      AND b.group_code = c.group_code
      AND a.payment_date BETWEEN '${data.from_dt}' AND '${data.to_dt}' AND a.tr_type = '${data.tr_type}'`,
      order = null;
      var member_dt = await db_Select(select,table_name,whr,order);
  
      res.send(member_dt);
});

module.exports = {loan_transRouter}