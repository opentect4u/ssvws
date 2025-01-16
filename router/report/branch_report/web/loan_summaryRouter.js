const { db_Select } = require('../../../../model/mysqlModel');

const express = require('express'),
loan_summaryrouter = express.Router(),
dateFormat = require('dateformat');

loan_summaryrouter.post ("/loan_summary_report_fundwise", async (req, res) => {
    var data = req.body;

    var select = "a.fund_id,sum(b.debit) tot_debit,sum(b.credit) tot_credit,sum(a.outstanding) tot_outstanding",
    table_name = "td_loan a,td_loan_transactions b",
    whr = `a.loan_id = b.loan_id 
           AND b.tr_type IN ('D','R')
           AND a.branch_code = '${data.branch_code}'
           AND date(b.payment_date) BETWEEN '${data.from_dt}' AND '${data.to_dt}'`
    order = `GROUP BY a.fund_id`;
    var fund_dt = await db_Select(select,table_name,whr,order);

    res.send(fund_dt)
})

module.exports = {loan_summaryrouter}