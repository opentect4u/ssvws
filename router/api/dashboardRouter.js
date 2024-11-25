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

    if (dashboard_dt.suc > 0 && dashboard_dt.msg.length > 0){
        var select = "SUM(credit)",
        table_name = "td_loan_transactions",
        whr = `branch_id = '${data.branch_code}'
        AND  tr_type = 'R'
        AND tr_mode = '${data.tr_mode}'
        AND payment_date = '${data.datetime}'`,
        order = null;
    var dashboard_dtls = await db_Select(select,table_name,whr,order);
    }

    dashboard_dt.msg[0]['app_dashboard_dt'] = dashboard_dtls.suc > 0 ? (dashboard_dtls.msg.length > 0 ? dashboard_dtls.msg : []) : [];

    res.send(dashboard_dt)
})

module.exports = {appdashboardRouter}
