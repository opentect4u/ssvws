const { db_Select, db_Insert } = require('../../../model/mysqlModel');

const express = require('express'),
monthEndRouter = express.Router(),
dateFormat = require('dateformat');

monthEndRouter.post("/fetch_monthend_branch_details", async (req, res) => {
  var data = req.body;

  var select = "a.branch_code,a.branch_name,b.closed_upto",
  table_name = "md_branch a LEFT JOIN td_month_close b ON a.branch_code = b.branch_code",
  whr = `a.branch_code <> 100`,
  order = null;
  var branch_data = await db_Select(select,table_name,whr,order);
  res.send(branch_data);
});

monthEndRouter.post("/update_month_end_data", async (req, res) => {
    var data = req.body;
    const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

       try {
           if (data.month_end_dt && data.month_end_dt.length > 0) {
   
               for (let dt of data.month_end_dt) {
   
                   var table_name = "td_month_close",
                       fields = `close_flag = ''`,
                       values = ``,
                       whr = `branch_code = '${data.branch_code}'`,
                       flag = 1;
   
                   var save_trans_mem_dtls = await db_Insert(table_name, fields, values, whr, flag);
               }
               res.send({ "suc": 1, "msg": "Transfer completed successfully" });
           } else {
               res.send({ "suc": 0, "msg": "No member details provided" });
           }
       } catch (error) {
           console.error(error);
           res.send({ "suc": 0, "msg": "Error occurred", details: error });
       }

});

module.exports = {monthEndRouter}