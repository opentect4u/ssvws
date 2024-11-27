const { db_Select } = require('../../model/mysqlModel');

const express = require('express'),
reportwebRouter = express.Router(),
dateFormat = require('dateformat');

reportwebRouter.post("/member_wise_recov_web", async (req, res) => {
    var data = req.body;

    var select = "a.credit,a.balance,b.group_code,b.member_code,c.group_name,d.client_name",
    table_name = "td_loan_transactions a JOIN td_loan b ON a.branch_id = b.branch_code AND a.loan_id = b.loan_id JOIN md_group c ON b.group_code = c.group_code JOIN md_member d ON b.member_code = d.member_code",
    whr = `date(a.payment_date) BETWEEN '${data.from_dt}' AND '${data.to_dt}' AND a.tr_type= 'R' AND a.tr_mode = '${data.tr_mode}'`,
    order = null;
    var recov_web_dt = await db_Select(select,table_name,whr,order);

    res.send(recov_web_dt)
});

reportwebRouter.post("/group_wise_recov_web", async (req, res) => {
    var data = req.body;

    var select = "SUM(a.credit),SUM(a.balance),b.group_code,c.group_name",
    table_name = "td_loan_transactions a JOIN td_loan b ON a.branch_id = b.branch_code AND a.loan_id = b.loan_id JOIN md_group c ON b.group_code = c.group_code",
    whr = `date(a.payment_date) BETWEEN '${data.from_dt}' AND '${data.to_dt}'
     AND a.tr_type= 'R' 
     AND a.tr_mode = '${data.tr_mode}'`,
    order = `GROUP BY b.group_code`;
    var grp_recov_web_dt = await db_Select(select,table_name,whr,order);

    res.send(grp_recov_web_dt)
});

module.exports = {reportwebRouter}