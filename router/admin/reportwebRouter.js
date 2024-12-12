const { db_Select } = require('../../model/mysqlModel');

const express = require('express'),
reportwebRouter = express.Router(),
dateFormat = require('dateformat');

reportwebRouter.post("/member_wise_recov_web", async (req, res) => {
    // var data = req.body;

    // var select = "a.credit,a.balance,b.group_code,b.member_code,c.group_name,d.client_name",
    // table_name = "td_loan_transactions a JOIN td_loan b ON a.branch_id = b.branch_code AND a.loan_id = b.loan_id JOIN md_group c ON b.group_code = c.group_code JOIN md_member d ON b.member_code = d.member_code",
    // whr = `date(a.payment_date) BETWEEN '${data.from_dt}' AND '${data.to_dt}' AND a.tr_type= 'R' 
    // AND a.tr_mode = '${data.tr_mode}'
    // AND a.branch_id = '${data.branch_code}'`,
    // order = null;
    // var recov_web_dt = await db_Select(select,table_name,whr,order);

    // res.send(recov_web_dt)

    var data = req.body;

    var select = "a.group_code,a.group_name,a.group_type,SUM(b.prn_amt + b.od_prn_amt) AS total_prn_amt,SUM(b.intt_amt + b.od_intt_amt) AS total_intt_amt,c.status",
    table_name = "md_group a JOIN td_loan b ON a.branch_code = b.branch_code AND a.group_code = b.group_code JOIN td_loan_transactions c ON b.branch_code = c.branch_id AND b.loan_id = c.loan_id",
    whr = `a.group_code like '%${data.grp_dtls_app}%' OR a.group_name like '%${data.grp_dtls_app}%' AND c.status = 'A'`
    order = `GROUP BY a.group_code, a.group_name, a.group_type, c.status`;
    var search_grp_app = await db_Select (select,table_name,whr,order);


    if(search_grp_app.suc > 0 && search_grp_app.msg.length > 0){
        for(let dt of search_grp_app.msg){

            var select = "a.loan_id,a.member_code,b.client_name,c.credit,c.balance",
            table_name = "td_loan a, md_member b, td_loan_transactions c",
            whr = `a.branch_code = b.branch_code 
            AND a.member_code = b.member_code
            AND a.loan_id = c.loan_id
            AND a.branch_code = c.branch_id
            AND a.branch_code = '${data.branch_code}'
            AND a.group_code = ${dt.group_code}
            AND date(c.payment_date) BETWEEN '${data.from_dt}' AND '${data.to_dt}' 
            AND c.tr_type = 'R'`,
            order = null;
            var mem_dt_app = await db_Select(select,table_name,whr,order);

       dt['memb_dtls_app'] = mem_dt_app.suc > 0 ? (mem_dt_app.msg.length > 0 ? mem_dt_app.msg : []) : [];
            
        }
    }

res.send(search_grp_app)
});

reportwebRouter.post("/group_wise_recov_web", async (req, res) => {
    var data = req.body;

    var select = "SUM(a.credit) credit,SUM(a.balance) balance,b.group_code,c.group_name",
    table_name = "td_loan_transactions a JOIN td_loan b ON a.branch_id = b.branch_code AND a.loan_id = b.loan_id JOIN md_group c ON b.group_code = c.group_code",
    whr = `date(a.payment_date) BETWEEN '${data.from_dt}' AND '${data.to_dt}'
     AND a.tr_type= 'R' 
     AND a.tr_mode = '${data.tr_mode}'
     AND a.branch_id = '${data.branch_code}'`,
    order = `GROUP BY b.group_code`;
    var grp_recov_web_dt = await db_Select(select,table_name,whr,order);

    res.send(grp_recov_web_dt)
});

reportwebRouter.post("/group_wise_disb_web", async (req, res) => {
    var data = req.body;

    var select = "SUM(a.debit),SUM(a.balance),b.group_code,c.group_name",
    table_name = "td_loan_transactions a JOIN td_loan b ON a.branch_id = b.branch_code AND a.loan_id = b.loan_id JOIN md_group c ON b.group_code = c.group_code",
    whr = `date(a.payment_date) BETWEEN '${data.from_dt}' AND '${data.to_dt}'
     AND a.tr_type= 'D' 
     AND a.tr_mode = '${data.tr_mode}'`,
    order = `GROUP BY b.group_code`;
    var grp_recov_web_dt = await db_Select(select,table_name,whr,order);

    res.send(grp_recov_web_dt)
});

module.exports = {reportwebRouter}