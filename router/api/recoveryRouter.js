const { db_Select } = require('../../model/mysqlModel');

const express = require('express'),
recoveryRouter = express.Router(),
dateFormat = require('dateformat');

recoveryRouter.post("/search_group_app", async (req, res) => {
    var data = req.body;

    var select = "a.group_code,b.group_name,SUM(a.prn_amt + a.od_prn_amt) AS total_prn_amt,SUM(a.intt_amt + a.od_intt_amt) AS total_intt_amt,c.status,b.group_type",
    table_name = "td_loan a LEFT JOIN md_group b ON a.branch_code = b.branch_code AND a.group_code = b.group_code LEFT JOIN td_loan_transactions c ON a.loan_id = c.loan_id",
    whr = `(a.group_code like '%${data.grp_dtls}%' OR b.group_name like '%${data.grp_dtls}%') AND c.status = 'A'`,
    order = `GROUP BY a.group_code, b.group_name, b.group_type`;
    var search_grp = await db_Select (select,table_name,whr,order);

    if(search_grp.suc > 0 && search_grp.msg.length > 0){
        var select = "a.loan_id,a.member_code,a.prn_amt,a.od_prn_amt,a.intt_amt,a.od_intt_amt,a.prn_emi,a.intt_emi,a.tot_emi,a.period,a.period_mode,a.instl_paid,a.instl_end_dt,b.client_name",
        table_name = "td_loan a LEFT JOIN md_member b ON a.branch_code = b.branch_code AND a.member_code = b.member_code",
        whr = `a.group_code = ${search_grp.msg[0].group_code}`,
        order = null;
        var mem_dt = await db_Select(select,table_name,whr,order);

        search_grp.msg[0]['memb_dtls'] = mem_dt.suc > 0 ? (mem_dt.msg.length > 0 ? mem_dt.msg : []) : [];
    }

res.send(search_grp)
});

module.exports = {recoveryRouter}