const { db_Select } = require('../../../../model/mysqlModel');

const express = require('express'),
loan_statementRouter = express.Router(),
dateFormat = require('dateformat');

loan_statementRouter.post("/loan_statement_memb_dtls", async (req, res) => {
    var data = req.body;
    
    //FETCH MEMBER DETAILS
    var select = "a.branch_code,a.member_code,b.group_code,a.client_name,b.loan_id,c.branch_name,d.group_name",
    table_name = "md_member a LEFT JOIN td_loan b ON a.branch_code = b.branch_code AND a.member_code = b.member_code LEFT JOIN md_branch c ON a.branch_code = c.branch_code LEFT JOIN md_group d ON b.branch_code = d.branch_code AND b.group_code = d.group_code",
    whr = `a.member_code like '%${data.memb}%' OR a.client_name like '%${data.memb}%'`,
    order = null;
    var member_dt = await db_Select(select,table_name,whr,order);

    res.send(member_dt);
});

loan_statementRouter.post("/loan_statement_report", async (req, res) => {
    var data = req.body;

    //FETCH LOAN STATEMENT DETAILS FOR PARTICULAR LOAN ID
    var select = "payment_date trans_date, payment_id trans_no,particulars,credit,debit,bank_charge,proc_charge,(balance + intt_balance)balance,tr_type,tr_mode",
    table_name = "td_loan_transactions",
    whr = `date(payment_date) BETWEEN '${data.from_dt}' AND '${data.to_dt}' AND loan_id = '${data.loan_id}'`,
    order = `ORDER BY date(payment_date),payment_id`;
    var loan_report_dt = await db_Select(select,table_name,whr,order);

    res.send(loan_report_dt);
});

loan_statementRouter.post("/loan_statement_group_dtls", async (req, res) => {
    var data = req.body;

    //FETCH GROUP DETAILS
    var select = "a.branch_code,a.group_code,a.group_name,SUM(b.outstanding) outstanding,c.branch_name",
    table_name = "md_group a LEFT JOIN td_loan b ON a.branch_code = b.branch_code AND a.group_code = b.group_code LEFT JOIN md_branch c ON a.branch_code = c.branch_code",
    whr = `a.group_code like '%${data.grp}%' OR a.group_name like '%${data.grp}%'`,
    order = `GROUP BY a.branch_code,a.group_code,a.group_name,c.branch_name`;
    var grp_dt = await db_Select(select,table_name,whr,order);

    res.send(grp_dt);
});

loan_statementRouter.post("/loan_statement_group_report", async (req, res) => {
    var data = req.body;

    //FETCH LOAN STATEMENT DETAILS FOR PARTICULAR GROUP CODE
    var select = " a.payment_date trans_date,a.payment_id trans_id,a.particulars,a.tr_type,SUM(a.debit) debit,SUM(a.credit) credit,SUM(a.bank_charge) bank_charge,SUM(a.proc_charge) proc_charge,SUM(a.balance + a.intt_balance) total",
    table_name = "td_loan_transactions a,td_loan b",
    whr = `a.branch_id = b.branch_code AND a.loan_id = b.loan_id AND b.group_code = '${data.group_code}'
    AND date(a.payment_date) BETWEEN '${data.from_dt}' AND '${data.to_dt}'`,
    order = `GROUP BY a.payment_date,a.payment_id,a.particulars,a.tr_type
    ORDER BY a.payment_date,a.payment_id`;
    var loan_report_dt = await db_Select(select,table_name,whr,order);

    res.send(loan_report_dt);
});

module.exports = {loan_statementRouter}