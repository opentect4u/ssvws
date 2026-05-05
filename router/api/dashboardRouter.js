const express = require('express'),
appdashboardRouter = express.Router(),
dateFormat = require('dateformat');

const {db_Select} = require('../../model/mysqlModel');

appdashboardRouter.post("/dashboard_dtls", async (req, res) => {
    var data = req.body;
    // console.log(data);
    
    //dashboard details
    var select = "COUNT(form_no) no_of_grt",
    table_name = "td_grt_basic",
    whr = data.day_type == 'T' ? `branch_code = '${data.branch_code}' AND created_by = '${data.emp_id}' AND date(grt_date) = '${data.datetime}'` : `branch_code = '${data.branch_code}' AND created_by = '${data.emp_id}' AND date(grt_date) between DATE_FORMAT('${data.datetime}', '%Y-%m-01') AND LAST_DAY('${data.datetime}')`,
    order = null;
    var dashboard_dt = await db_Select(select,table_name,whr,order);

    res.send(dashboard_dt)
});

appdashboardRouter.post("/dashboard_dtls_cash_recov", async (req, res) => {
    var data = req.body;
    // console.log(data,'sss');
    
    //how many recovery done via cash show in dashboard
    var select = "IFNULL(SUM(credit),0) tot_recov_cash",
    table_name = "td_loan_transactions",
    whr = data.day_type == 'T' ? `branch_id = '${data.branch_code}'
    AND tr_type = 'R'
    AND tr_mode = '${data.tr_mode}'
    AND date(payment_date) = '${data.datetime}'
    AND created_by = ${data.created_by}` : `branch_id = '${data.branch_code}'
    AND tr_type = 'R'
    AND tr_mode = '${data.tr_mode}'
    AND date(payment_date) between DATE_FORMAT('${data.datetime}', '%Y-%m-01') AND LAST_DAY('${data.datetime}')
    AND created_by = ${data.created_by}`,
    order = null;
    var dashboard_dt_cash = await db_Select(select,table_name,whr,order);

    res.send(dashboard_dt_cash)
});

appdashboardRouter.post("/dashboard_dtls_bank_recov", async (req, res) => {
    var data = req.body;
    // console.log(data,'fr');
    
    
    //how many recovery done via bank show in dashboard
    var select = "IFNULL(SUM(credit),0) tot_recov_bank",
    table_name = "td_loan_transactions",
    whr = data.day_type == 'T' ? `branch_id = '${data.branch_code}'
    AND tr_type = 'R'
    AND tr_mode = '${data.tr_mode}'
    AND date(payment_date) = '${data.datetime}'
    AND created_by = '${data.emp_id}'` : `branch_id = '${data.branch_code}'
    AND tr_type = 'R'
    AND tr_mode = '${data.tr_mode}'
    AND date(payment_date) between DATE_FORMAT('${data.datetime}', '%Y-%m-01') AND LAST_DAY('${data.datetime}')
    AND created_by = '${data.emp_id}'`,
    order = null;
    var dashboard_dt_bank = await db_Select(select,table_name,whr,order);

    res.send(dashboard_dt_bank)
});

appdashboardRouter.post("/dashboard_dtls_disb", async (req, res) => {
    var data = req.body;

    //how many disburse done show in dashboard
    var select = "IFNULL(SUM(prn_disb_amt),0) tot_disburse",
    table_name = "td_loan",
    whr = data.day_type == 'T' ? `branch_code = '${data.branch_code}'
    AND date(disb_dt) = '${data.datetime}'
    AND created_by = '${data.emp_id}'` : `branch_code = '${data.branch_code}'
    AND date(disb_dt) between DATE_FORMAT('${data.datetime}', '%Y-%m-01') AND LAST_DAY('${data.datetime}')
    AND created_by = '${data.emp_id}'`,
    order = null;
    var dashboard_dt_disb = await db_Select(select,table_name,whr,order);

    res.send(dashboard_dt_disb)
});

appdashboardRouter.post("/dashboard_dtls_bm", async (req, res) => {
    var data = req.body;
    // console.log(data);
    
    //dashboard details in branch manager
        var select = "COUNT(form_no) no_of_grt",
        table_name = "td_grt_basic",
        whr = data.flag == 'O' ? 
        `branch_code = '${data.branch_code}' AND modified_by = ${data.emp_id} AND date(grt_date) between DATE_FORMAT('${data.datetime}', '%Y-%m-01') AND LAST_DAY('${data.datetime}')` : `branch_code = '${data.branch_code}' AND date(grt_date) between DATE_FORMAT('${data.datetime}', '%Y-%m-01') AND LAST_DAY('${data.datetime}')`,
        order = null;
        var dashboard_dt = await db_Select(select,table_name,whr,order);

    res.send(dashboard_dt)
});

appdashboardRouter.post("/dashboard_dtls_cash_recov_bm", async (req, res) => {
    var data = req.body;

    //how many recovery done via cash by branch manager show in dashboard
    var select = "IFNULL(SUM(credit),0) tot_recov_cash",
    table_name = "td_loan_transactions",
    whr = data.flag == 'O' ? `branch_id = '${data.branch_code}'
    AND tr_type = 'R'
    AND tr_mode = '${data.tr_mode}'
    AND date(payment_date) between DATE_FORMAT('${data.datetime}', '%Y-%m-01') AND LAST_DAY('${data.datetime}')
    AND created_by = ${data.emp_id}` 
    : `branch_id = '${data.branch_code}'
     AND tr_type = 'R'
    AND tr_mode = '${data.tr_mode}'
    AND date(payment_date) between DATE_FORMAT('${data.datetime}', '%Y-%m-01') AND LAST_DAY('${data.datetime}')`,
    order = null;
    var dashboard_dt_cash_bm = await db_Select(select,table_name,whr,order);

    res.send(dashboard_dt_cash_bm)
});

appdashboardRouter.post("/dashboard_dtls_bank_recov_bm", async (req, res) => {
    var data = req.body;

    //how many recovery done via bank by branch manager show in dashboard
    var select = "IFNULL(SUM(credit),0) tot_recov_bank",
    table_name = "td_loan_transactions",
    whr =  data.flag == 'O' ? `branch_id = '${data.branch_code}'
    AND tr_type = 'R'
    AND tr_mode = '${data.tr_mode}'
    AND date(payment_date) between DATE_FORMAT('${data.datetime}', '%Y-%m-01') AND LAST_DAY('${data.datetime}')
    AND created_by = ${data.emp_id}` 
    : `branch_id = '${data.branch_code}'
    AND tr_type = 'R'
    AND tr_mode = '${data.tr_mode}'
    AND date(payment_date) between DATE_FORMAT('${data.datetime}', '%Y-%m-01') AND LAST_DAY('${data.datetime}')`,
    order = null;
    var dashboard_dt_bank_bm = await db_Select(select,table_name,whr,order);

    res.send(dashboard_dt_bank_bm)
});

appdashboardRouter.post("/dashboard_dtls_bm_disb", async (req, res) => {
    var data = req.body;

    //how many disburse done show in dashboard
    var select = "IFNULL(SUM(prn_disb_amt),0) tot_disburse",
    table_name = "td_loan",
    whr = data.flag == 'O' ? `branch_code = '${data.branch_code}'
    AND date(disb_dt) between DATE_FORMAT('${data.datetime}', '%Y-%m-01') AND LAST_DAY('${data.datetime}')
    AND created_by = '${data.emp_id}'` : `branch_code = '${data.branch_code}'
    AND date(disb_dt) between DATE_FORMAT('${data.datetime}', '%Y-%m-01') AND LAST_DAY('${data.datetime}')`,
    order = null;
    var dashboard_dt_bm_disb = await db_Select(select,table_name,whr,order);

    res.send(dashboard_dt_bm_disb)
});

module.exports = {appdashboardRouter}
