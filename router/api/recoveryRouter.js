const { db_Select } = require('../../model/mysqlModel');
const { recovery_trans } = require('../../modules/api/recoveryModule');

const express = require('express'),
recoveryRouter = express.Router(),
dateFormat = require('dateformat');

recoveryRouter.post("/search_group_app", async (req, res) => {
    var data = req.body;

    var select = "a.group_code,b.group_name,SUM(a.prn_amt + a.od_prn_amt) AS total_prn_amt,SUM(a.intt_amt + a.od_intt_amt) AS total_intt_amt,c.status,b.group_type",
    table_name = "td_loan a LEFT JOIN md_group b ON a.branch_code = b.branch_code AND a.group_code = b.group_code LEFT JOIN td_loan_transactions c ON a.branch_code = c.branch_id AND a.loan_id = c.loan_id",
    whr = `(a.group_code like '%${data.grp_dtls}%' OR b.group_name like '%${data.grp_dtls}%') AND c.status = 'A'`,
    order = `GROUP BY a.group_code, b.group_name, b.group_type`;
    var search_grp = await db_Select (select,table_name,whr,order);

    if(search_grp.suc > 0 && search_grp.msg.length > 0){
        var select = "a.loan_id,a.member_code,a.period,a.curr_roi,a.prn_disb_amt,a.intt_cal_amt,a.prn_amt,a.od_prn_amt,a.intt_amt,a.od_intt_amt,a.prn_emi,a.intt_emi,a.tot_emi,a.period,a.period_mode,a.instl_paid,a.instl_end_dt,a.last_trn_dt,b.client_name,c.status, c.balance, c.intt_balance, c.payment_date",
        table_name = "td_loan a, md_member b, td_loan_transactions c",
        whr = `a.branch_code = b.branch_code 
        AND a.member_code = b.member_code
        AND a.branch_code = c.branch_id 
        AND  a.loan_id = c.loan_id
        AND a.group_code = ${search_grp.msg[0].group_code} AND c.status = 'A'
        AND c.payment_date = (SELECT MAX(d.payment_date) FROM td_loan_transactions d WHERE a.branch_code = d.branch_id AND a.loan_id = d.loan_id)`,
        order = null;
        var mem_dt = await db_Select(select,table_name,whr,order);

        search_grp.msg[0]['memb_dtls'] = mem_dt.suc > 0 ? (mem_dt.msg.length > 0 ? mem_dt.msg : []) : [];
    }

res.send(search_grp)
});

recoveryRouter.post("/recovery_transaction", async (req, res) => {
    var data = req.body,res_dt;
    recovery_trans(data).then(data => {
        res_dt = data
    }).catch(err => {
        res_dt = err
    }).finally (() => {
        res.send(res_dt)
    })

});

recoveryRouter.post("/view_transaction", async (req, res) => {
    var data = req.body;

    var select = "a.loan_id,a.member_code,a.period,a.curr_roi,a.prn_disb_amt,a.intt_cal_amt,a.prn_amt,a.od_prn_amt,a.intt_amt,a.od_intt_amt,a.outstanding,a.prn_emi,a.intt_emi,a.tot_emi,a.recovery_day,a.period,a.period_mode,a.instl_paid,a.instl_start_dt,a.instl_end_dt,a.last_trn_dt,b.client_name,c.credit,c.debit,c.prn_recov,c.intt_recov,c.balance,c.intt_balance,c.recov_upto,c.tr_type,c.status,c.payment_date,c.trn_lat,c.trn_long,c.trn_addr",
    table_name = "td_loan a, md_member b, td_loan_transactions c",
    whr = `a.branch_code = b.branch_code 
        AND a.member_code = b.member_code
        AND a.branch_code = c.branch_id 
        AND a.loan_id = c.loan_id
        ${data.loan_id > 0 ? `AND a.loan_id = '${data.loan_id}'` : ''}
        AND c.status = '${data.approval_status}'
        AND c.tr_type = 'R'`,
    order = "Order BY a.member_code";
    var view_dt = await db_Select(select,table_name,whr,order);

    res.send(view_dt)
})

module.exports = {recoveryRouter}