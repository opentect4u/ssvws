const { db_Select } = require('../../model/mysqlModel');

const express = require('express'),
reportRouter = express.Router(),
dateFormat = require('dateformat');

reportRouter.post("/member_wise_recovery", async (req, res) => {
    var data = req.body, member_recov_dt;

    if(data.user_id == '1'){
        var select = "a.credit,b.group_code,b.member_code,c.group_name,d.client_name",
        table_name = "td_loan_transactions a JOIN td_loan b ON a.branch_id = b.branch_code AND a.loan_id = b.loan_id JOIN md_group c ON b.group_code = c.group_code JOIN md_member d ON b.member_code = d.member_code",
        whr = `date(a.payment_date) BETWEEN '${data.from_dt}' AND '${data.to_dt}' AND a.tr_type= 'R' AND a.tr_mode = '${data.tr_mode}' AND a.created_by = '${data.emp_id}'`,
        order = null;
        member_recov_dt = await db_Select(select,table_name,whr,order);
    }else if (data.user_id == '2' && data.flag == 'O'){
        var select = "a.credit,b.group_code,b.member_code,c.group_name,d.client_name",
        table_name = "td_loan_transactions a JOIN td_loan b ON a.branch_id = b.branch_code AND a.loan_id = b.loan_id JOIN md_group c ON b.group_code = c.group_code JOIN md_member d ON b.member_code = d.member_code",
        whr = `date(a.payment_date) BETWEEN '${data.from_dt}' AND '${data.to_dt}' AND a.tr_type= 'R'
              AND a.tr_mode = '${data.tr_mode}' AND a.created_by = '${data.emp_id}'`,
        order = null;
        member_recov_dt = await db_Select(select,table_name,whr,order);
    }else {
        var select = "a.credit,b.group_code,b.member_code,c.group_name,d.client_name",
        table_name = "td_loan_transactions a JOIN td_loan b ON a.branch_id = b.branch_code AND a.loan_id = b.loan_id JOIN md_group c ON b.group_code = c.group_code JOIN md_member d ON b.member_code = d.member_code",
        whr = `date(a.payment_date) BETWEEN '${data.from_dt}' AND '${data.to_dt}' AND a.tr_type= 'R'
              AND a.tr_mode = '${data.tr_mode}' AND a.branch_id = '${data.branch_code}'`,
        order = null;
        member_recov_dt = await db_Select(select,table_name,whr,order);
    }
    
    res.send(member_recov_dt)
});

reportRouter.post("/member_wise_disb", async (req, res) => {
    var data = req.body, member_recov_dt;

    
        var select = "a.credit,a.balance,b.group_code,c.group_name",
        table_name = "td_loan_transactions a JOIN td_loan b ON a.branch_id = b.branch_code AND a.loan_id = b.loan_id JOIN md_group c ON b.group_code = c.group_code",
        whr = `date(a.payment_date) BETWEEN '${data.from_dt}' AND '${data.to_dt}' AND a.tr_type= 'D'
              AND a.tr_mode = '${data.tr_mode}' AND a.created_by = '${data.emp_id}'`,
        order = null;
        member_disb_dt = await db_Select(select,table_name,whr,order);
    
    res.send(member_disb_dt)
})

module.exports = {reportRouter}