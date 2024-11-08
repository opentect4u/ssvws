const { db_Select } = require('../../model/mysqlModel');

const express = require('express'),
recoveryRouter = express.Router(),
dateFormat = require('dateformat');

recoveryRouter.post("/search_group_app", async (req, res) => {
    var data = req.body;

    var select = "a.group_code,b.group_name,SUM(a.prn_amt + a.od_prn_amt) AS total_prn_amt,SUM(a.intt_amt + a.od_intt_amt) AS total_intt_amt,c.status",
    table_name = "td_loan a LEFT JOIN md_group b ON a.branch_code = b.branch_code AND a.group_code = b.group_code LEFT JOIN td_loan_transactions c ON a.loan_id = c.loan_id",
    whr = `(a.group_code like '%${data.grp_dtls}%' OR b.group_name like '%${data.grp_dtls}%') AND c.status = 'A'`,
    order = `GROUP BY a.group_code, b.group_name`;
    var search_grp = await db_Select (select,table_name,whr,order);

res.send(search_grp)
});

module.exports = {recoveryRouter}