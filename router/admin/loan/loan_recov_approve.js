const { db_Select } = require('../../../model/mysqlModel');

const express = require('express'),
loan_recov_approveRouter = express.Router(),
dateFormat = require('dateformat');

loan_recov_approveRouter.post("/fetch_groupwise_recovery_admin", async (req, res) => {
    var data = req.body;

    //FETCH GROUPWISE RECOVERY DATA
    var select = "a.payment_date transaction_date,SUM(a.credit) credit_amt,b.group_code,SUM(b.tot_emi) tot_emi,a.created_by created_code,c.group_name,d.emp_name created_by,SUM(a.balance+a.od_balance+a.intt_balance) outstanding",
    table_name = "td_loan_transactions a JOIN td_loan b ON a.loan_id = b.loan_id JOIN md_group c ON b.group_code = c.group_code LEFT JOIN md_employee d ON a.created_by = d.emp_id",
    whr = `a.branch_id = '${data.branch_code}' AND a.status = 'U' AND a.tr_type = 'R' AND date(a.payment_date) BETWEEN '${data.from_dt}' AND '${data.to_dt}'`,
    order = `GROUP BY a.payment_date,b.group_code,a.created_by,c.group_name,d.emp_name`;
    var fetch_grp_dt = await db_Select(select,table_name,whr,order);

    res.send(fetch_grp_dt);
});

loan_recov_approveRouter.post("/fetch_grp_member_dtls", async (req, res) => {
    var data = req.body;

    //FETCH GROUPWISE RECOVERY DATA OF MEMBER
    var select = "a.payment_date transaction_date,a.payment_id,c.group_name,b.loan_id,b.tot_emi,e.client_name,a.credit amt,if(a.tr_mode='C','Cash','UPI')tr_mode,a.created_by creted_code,d.emp_name created_by,(a.balance+a.od_balance+a.intt_balance) outstanding",
    table_name = "td_loan_transactions a JOIN td_loan b ON a.loan_id = b.loan_id JOIN md_group c ON b.group_code = c.group_code LEFT JOIN md_employee d ON a.created_by = d.emp_id LEFT JOIN md_member e ON b.member_code = e.member_code",
    whr = `a.branch_id = '${data.branch_code}' AND a.status = 'U' AND a.tr_type = 'R' AND date(a.payment_date) BETWEEN '${data.from_dt}' AND '${data.to_dt}' AND b.group_code = '${data.group_code}'`,
    order = null;
    var fetch_grp_memb_dt = await db_Select(select,table_name,whr,order);

    res.send(fetch_grp_memb_dt);

});

loan_recov_approveRouter.post("/fetch_memberwise_recovery_admin", async (req, res) => {
    var data = req.body;

        //FETCH MEMBERWISE RECOVERY DATA
        var select = "a.payment_date transaction_date,a.payment_id,c.group_name,b.loan_id,b.tot_emi,e.client_name,a.credit amt,if(a.tr_mode='C','Cash','UPI')tr_mode,a.created_by creted_code,d.emp_name created_by,(a.balance+a.od_balance+a.intt_balance) outstanding",
        table_name = "td_loan_transactions a JOIN td_loan b ON a.loan_id = b.loan_id JOIN md_group c ON b.group_code = c.group_code LEFT JOIN md_employee d ON a.created_by = d.emp_id LEFT JOIN md_member e ON b.member_code = e.member_code",
        whr = `a.branch_id = '${data.branch_code}' AND a.status = 'U' AND a.tr_type = 'R' AND date(a.payment_date) BETWEEN '${data.from_dt}' AND '${data.to_dt}'`,
        order = null;
        var fetch_recov_memb_dt = await db_Select(select,table_name,whr,order);
   
        res.send(fetch_recov_memb_dt)
});

loan_recov_approveRouter.post("/fetch_branch_co", async (req, res) => {
    var data = req.body;

     //FETCH BRANCHWISE CO NAME
    var select = "a.emp_id,a.emp_name",
    table_name = "md_employee a LEFT JOIN md_user b ON a.emp_id = b.emp_id",
    whr = `a.branch_id = '${data.branch_code}' AND b.user_type = '1' AND b.user_status = 'A'`,
    order = null;
    var branch_co_dt = await db_Select(select,table_name,whr,order);

    res.send(branch_co_dt)
});

loan_recov_approveRouter.post("/fetch_cowise_recov_data", async (req, res) => {
    var data = req.body;

     //FETCH COWISE RECOVERY DATA
     var select = "a.payment_date transaction_date,SUM(a.credit) credit_amt,b.group_code,SUM(b.tot_emi) tot_emi,a.created_by created_code,c.group_name,d.emp_name created_by,SUM(a.balance+a.od_balance+a.intt_balance) outstanding",
     table_name = "td_loan_transactions a JOIN td_loan b ON a.loan_id = b.loan_id JOIN md_group c ON b.group_code = c.group_code LEFT JOIN md_employee d ON a.created_by = d.emp_id",
     whr = `a.branch_id = '${data.branch_code}' AND a.status = 'U' AND a.tr_type = 'R' AND date(a.payment_date) BETWEEN '${data.from_dt}' AND '${data.to_dt}' AND a.created_by = '${data.co_id}'`,
     order = `GROUP BY a.payment_date,b.group_code,a.created_by,c.group_name,d.emp_name`;
     var fetch_grp_dt = await db_Select(select,table_name,whr,order);
 
     res.send(fetch_grp_dt);
});

loan_recov_approveRouter.post("/fetch_cowise_recov_member_dtls", async (req, res) => {
    var data = req.body;

    //FETCH COWISE RECOVERY DATA OF MEMBER
    var select = "a.payment_date transaction_date,a.payment_id,c.group_name,b.loan_id,b.tot_emi,e.client_name,a.credit amt,if(a.tr_mode='C','Cash','UPI')tr_mode,a.created_by creted_code,d.emp_name created_by,(a.balance+a.od_balance+a.intt_balance) outstanding",
    table_name = "td_loan_transactions a JOIN td_loan b ON a.loan_id = b.loan_id JOIN md_group c ON b.group_code = c.group_code LEFT JOIN md_employee d ON a.created_by = d.emp_id LEFT JOIN md_member e ON b.member_code = e.member_code",
    whr = `a.branch_id = '${data.branch_code}' AND a.status = 'U' AND a.tr_type = 'R' AND date(a.payment_date) BETWEEN '${data.from_dt}' AND '${data.to_dt}' AND a.created_by = '${data.co_id}'`,
    order = null;
    var fetch_co_memb_dt = await db_Select(select,table_name,whr,order);

    res.send(fetch_co_memb_dt);

});

module.exports = {loan_recov_approveRouter}