const { db_Select } = require('../../model/mysqlModel');

const express = require('express'),
reportRouter = express.Router(),
dateFormat = require('dateformat');

reportRouter.post("/transaction_dtls_print", async (req, res) => {
    var data = req.body;

    var select = `a.loan_id,a.branch_code,a.group_code,a.member_code,b.payment_date tnx_date,b.payment_id tnx_id,b.credit,b.balance curr_balance,(
                SELECT SUM(i.balance + i.intt_balance)
                FROM td_loan_transactions i
                WHERE i.tr_type = 'I' AND i.loan_id = a.loan_id
            ) AS prev_balance,c.group_name,d.branch_name,e.client_name`,
    table_name = "td_loan a JOIN td_loan_transactions b ON a.loan_id = b.loan_id AND a.branch_code = b.branch_id JOIN md_group c ON a.branch_code = c.branch_code AND a.group_code = c.group_code JOIN md_branch d ON a.branch_code = d.branch_code JOIN md_member e ON a.branch_code = e.branch_code AND a.member_code = e.member_code",
    whr = `a.loan_id = '${data.loan_id}'`,
    order = null;

    var trans_dtl = await db_Select(select,table_name,whr,order);

    res.send(trans_dtl)
})

module.exports = {reportRouter}