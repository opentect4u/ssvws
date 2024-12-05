const express = require('express'),
appdashboardRouter = express.Router(),
dateFormat = require('dateformat');

const {db_Select} = require('../../model/mysqlModel');

appdashboardRouter.post("/dashboard_dtls", async (req, res) => {
    var data = req.body;
    console.log(data);
    
    var select = "COUNT(form_no) no_of_grt",
    table_name = "td_grt_basic",
    whr = `created_by = ${data.emp_id} AND date(grt_date) = '${data.datetime}'`,
    order = null;
    var dashboard_dt = await db_Select(select,table_name,whr,order);

    res.send(dashboard_dt)
});

appdashboardRouter.post("/dashboard_dtls_cash_recov", async (req, res) => {
    var data = req.body;

    var select = "SUM(credit) tot_recov_cash",
    table_name = "td_loan_transactions",
    whr = `branch_id = '${data.branch_code}'
    AND tr_type = 'R'
    AND tr_mode = '${data.tr_mode}'
    AND date(payment_date) = '${data.datetime}'
    AND created_by = ${data.emp_id}`,
    order = null;
    var dashboard_dt_cash = await db_Select(select,table_name,whr,order);

    res.send(dashboard_dt_cash)
});

appdashboardRouter.post("/dashboard_dtls_bank_recov", async (req, res) => {
    var data = req.body;
    
    var select = "SUM(credit) tot_recov_bank",
    table_name = "td_loan_transactions",
    whr = `branch_id = '${data.branch_code}'
    AND tr_type = 'R'
    AND tr_mode = '${data.tr_mode}'
    AND date(payment_date) = '${data.datetime}'
    AND created_by =' ${data.emp_id}'`,
    order = null;
    var dashboard_dt_bank = await db_Select(select,table_name,whr,order);

    res.send(dashboard_dt_bank)
});

appdashboardRouter.post("/dashboard_dtls_bm", async (req, res) => {
    var data = req.body;
    console.log(data);
    
        var select = "COUNT(form_no) no_of_grt",
        table_name = "td_grt_basic",
        whr = data.flag == 'O' ? 
        `modified_by = ${data.emp_id} AND date(grt_date) = '${data.datetime}'` 
        : `branch_code = '${data.branch_code}' AND date(grt_date) = '${data.datetime}'`,
        order = null;
        var dashboard_dt = await db_Select(select,table_name,whr,order);

    res.send(dashboard_dt)
});

appdashboardRouter.post("/dashboard_dtls_cash_recov_bm", async (req, res) => {
    var data = req.body;

    var select = "SUM(credit) tot_recov_cash",
    table_name = "td_loan_transactions",
    whr = data.flag == 'O' ? `branch_id = '${data.branch_code}'
    AND tr_type = 'R'
    AND tr_mode = '${data.tr_mode}'
    AND date(payment_date) = '${data.datetime}'
    AND created_by = ${data.emp_id}` 
    : `branch_id = '${data.branch_code}'
     AND tr_type = 'R'
    AND tr_mode = '${data.tr_mode}'
    AND date(payment_date) = '${data.datetime}'`,
    order = null;
    var dashboard_dt_cash_bm = await db_Select(select,table_name,whr,order);

    res.send(dashboard_dt_cash_bm)
});

appdashboardRouter.post("/dashboard_dtls_bank_recov_bm", async (req, res) => {
    var data = req.body;

    var select = "SUM(credit) tot_recov_bank",
    table_name = "td_loan_transactions",
    whr =  data.flag == 'O' ? `branch_id = '${data.branch_code}'
    AND tr_type = 'R'
    AND tr_mode = '${data.tr_mode}'
    AND date(payment_date) = '${data.datetime}'
    AND created_by = ${data.emp_id}` 
    : `branch_id = '${data.branch_code}'
    AND tr_type = 'R'
    AND tr_mode = '${data.tr_mode}'
     AND date(payment_date) = '${data.datetime}'`,
    order = null;
    var dashboard_dt_bank_bm = await db_Select(select,table_name,whr,order);

    res.send(dashboard_dt_bank_bm)
});

module.exports = {appdashboardRouter}
