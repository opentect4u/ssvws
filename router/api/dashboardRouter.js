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
})

module.exports = {appdashboardRouter}
