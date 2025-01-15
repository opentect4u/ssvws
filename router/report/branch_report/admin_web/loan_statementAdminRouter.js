const { db_Select } = require('../../../../model/mysqlModel');

const express = require('express'),
loan_statementAdminRouter = express.Router(),
dateFormat = require('dateformat');

loan_statementAdminRouter.post("/loan_statement_memb_dtls_admin", async (req, res) => {
    var data = req.body;
    
    //FETCH MEMBER DETAILS
    var select = "a.branch_code,a.member_code,b.group_code,a.client_name,b.loan_id,c.branch_name,d.group_name",
    table_name = "md_member a LEFT JOIN td_loan b ON a.branch_code = b.branch_code AND a.member_code = b.member_code LEFT JOIN md_branch c ON a.branch_code = c.branch_code LEFT JOIN md_group d ON a.branch_code = d.branch_code AND b.group_code = d.group_code",
    whr = `a.member_code like '%${data.memb}%' OR a.client_name like '%${data.memb}%'`,
    order = null;
    var member_dt = await db_Select(select,table_name,whr,order);

    res.send(member_dt);
});

loan_statementAdminRouter.post("/loan_statement_report_admin", async (req, res) => {
    var data = req.body;

    //FETCH LOAN STATEMENT DETAILS FOR PARTICULAR LOAN ID
    var select = `a.payment_date trans_date, a.payment_id trans_no,a.particulars,a.credit,a.debit,a.bank_charge,a.proc_charge,a.prn_recov,a.intt_recov,a.balance prn_bal,a.od_balance,a.intt_balance intt_bal,(a.balance + a.intt_balance) total,a.tr_type,a.tr_mode,b.curr_roi,b.period,b.period_mode,b.tot_emi`,
    table_name = "td_loan_transactions a, td_loan b",
    whr = `a.branch_id = b.branch_code AND a.loan_id = b.loan_id AND date(a.payment_date) BETWEEN '${data.from_dt}' AND '${data.to_dt}' AND a.loan_id = '${data.loan_id}' AND a.tr_type != 'O' AND a.tr_type != 'I'`,
    order = `ORDER BY date(a.payment_date),a.payment_id`;
    var loan_report_dt = await db_Select(select,table_name,whr,order);
    res.send(loan_report_dt);
});

loan_statementAdminRouter.post("/loan_statement_group_dtls", async (req, res) => {
    var data = req.body;

    //FETCH GROUP DETAILS
    var select = "a.branch_code,a.group_code,a.group_name,SUM(b.outstanding) outstanding,c.branch_name",
    table_name = "md_group a LEFT JOIN td_loan b ON a.group_code = b.group_code LEFT JOIN md_branch c ON a.branch_code = c.branch_code",
    whr = `a.branch_code = '${data.branch_code}' AND a.group_code like '%${data.grp}%' OR a.group_name like '%${data.grp}%'`,
    order = `GROUP BY a.branch_code,a.group_code,a.group_name,c.branch_name`;
    var grp_dt = await db_Select(select,table_name,whr,order);

    res.send(grp_dt);
});

loan_statementAdminRouter.post("/loan_statement_group_report", async (req, res) => {
    var data = req.body;

    //FETCH LOAN STATEMENT DETAILS FOR PARTICULAR GROUP CODE
    var select = "trans_date,particulars,tr_type,sum(debit)debit,sum(credit)credit,sum(bank_charge)bank_charge,sum(proc_charge)proc_charge,sum(total)balance,curr_roi,period,period_mode,tot_emi",
    table_name = `(
        select a.payment_date trans_date,a.payment_id trans_id,a.particulars particulars,a.tr_type tr_type,SUM(a.debit) debit,SUM(a.credit) credit,SUM(a.bank_charge) bank_charge,SUM(a.proc_charge) proc_charge,SUM(a.balance + a.od_balance +a.intt_balance) total,b.curr_roi,b.period,b.period_mode,b.tot_emi
        from td_loan_transactions a,td_loan b  
        where a.branch_id = b.branch_code AND a.loan_id = b.loan_id AND b.group_code = '${data.group_code}'
        AND date(a.payment_date) BETWEEN '${data.from_dt}' AND '${data.to_dt}'
        GROUP BY a.payment_date,a.particulars,a.payment_id,a.tr_type,b.curr_roi,b.period,b.period_mode,b.tot_emi
        ORDER BY a.payment_date,a.payment_id)a`,
    whr = null,
    order = `GROUP BY trans_date,particulars,tr_type,curr_roi,period,period_mode,tot_emi`;
    var loan_report_dt = await db_Select(select,table_name,whr,order);

    res.send(loan_report_dt);
});

module.exports = {loan_statementAdminRouter}