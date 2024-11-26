const { db_Select } = require('../../model/mysqlModel');

const express = require('express'),
reportRouter = express.Router(),
dateFormat = require('dateformat');

reportRouter.post("/member_wise_recovery", async (req, res) => {
    var data = req.body;

    var select = "a.credit,b.group_code,b.member_code,c.group_name,d.client_name",
    table_name = "td_loan_transactions a JOIN td_loan b ON a.branch_id = b.branch_code AND a.loan_id = b.loan_id JOIN md_group c ON b.group_code = c.group_code JOIN md_member d ON b.member_code = d.member_code",
    whr = `date(a.payment_date) BETWEEN '${data.from_dt}' AND '${data.to_dt}'
          AND a.tr_mode = 'C' AND a.created_by = '${data.emp_id}'`,
    order = null;
    var member_recov_dt = await db_Select(select,table_name,whr,order);

    res.send(member_recov_dt)
})

module.exports = {reportRouter}