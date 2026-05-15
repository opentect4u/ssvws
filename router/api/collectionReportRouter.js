const { db_Select } = require('../../model/mysqlModel');

const express = require('express'),
collReportRouter = express.Router(),
dateFormat = require('dateformat');

// collection report fetch from co end
collReportRouter.post("/coll_report_app_cowise", async (req, res) => {
    try{
    var data = req.body;
    console.log(data,'app_co_coll');

    var select = "b.member_code,d.client_name,b.group_code,c.group_name,f.bank_name,f.branch_name bank_branch_name,c.acc_no1 sb_account,c.acc_no2 loan_account,b.scheme_id,e.scheme_name,a.tr_mode,a.credit AS credit,a.prn_recov AS prn_recov,a.intt_recov AS intt_recov,(b.prn_amt + b.od_prn_amt + b.intt_amt)curr_balance",
    table_name = "td_loan_transactions a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_group c ON b.group_code = c.group_code LEFT JOIN md_member d ON b.member_code = d.member_code LEFT JOIN md_scheme e ON b.scheme_id = e.scheme_id LEFT JOIN md_bank f ON c.bank_name = f.bank_code",
    whr = `b.branch_code = '${data.branch_code}' AND a.payment_date BETWEEN '${data.from_dt}' AND '${data.to_dt}' AND a.tr_type = 'R' AND a.created_by = '${data.co_id}'`;

    // CASH / UPI / ALL
    if (data.tr_mode !== 'A') {
      whr += ` AND a.tr_mode = '${data.tr_mode}'`;
    }

    order = `ORDER BY a.payment_date`;
    var coll_data_cowise = await db_Select(select,table_name,whr,order);
    res.send({coll_data_cowise})
    }catch(error){
        console.error("Error while fetching collection report cowise:", error);
        res.send({ suc: 0, msg: "An error occurred" });
    }
});

//collection report fetch from bmend
collReportRouter.post("/coll_report_app_bmwise", async (req, res) => {
    try{
    var data = req.body;
    console.log(data,'app_bm_coll');

    var select = "b.member_code,d.client_name,b.group_code,c.group_name,a.created_by AS co_id,g.emp_name AS co_name,f.bank_name,f.branch_name bank_branch_name,c.acc_no1 sb_account,c.acc_no2 loan_account,b.scheme_id,e.scheme_name,a.tr_mode,a.credit AS credit,a.prn_recov AS prn_recov,a.intt_recov AS intt_recov,(b.prn_amt + b.od_prn_amt + b.intt_amt)curr_balance",
    table_name = "td_loan_transactions a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_group c ON b.group_code = c.group_code LEFT JOIN md_member d ON b.member_code = d.member_code LEFT JOIN md_scheme e ON b.scheme_id = e.scheme_id LEFT JOIN md_bank f ON c.bank_name = f.bank_code LEFT JOIN md_employee g ON a.created_by = g.emp_id",
    whr = `b.branch_code = '${data.branch_code}' AND a.payment_date BETWEEN '${data.from_dt}' AND '${data.to_dt}' AND a.tr_type = 'R'`;

    // CASH / UPI / ALL
    if (data.tr_mode !== 'A') {
      whr += ` AND a.tr_mode = '${data.tr_mode}'`;
    }

    order = `ORDER BY a.payment_date`;
    var coll_data_bmwise = await db_Select(select,table_name,whr,order);
    res.send({coll_data_bmwise})
    }catch(error){
        console.error("Error while fetching collection report bmwise:", error);
        res.send({ suc: 0, msg: "An error occurred" });
    }
});

module.exports = {collReportRouter}