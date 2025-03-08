const { db_Select, db_Insert } = require('../../../model/mysqlModel');

const express = require('express'),
monthEndRouter = express.Router(),
dateFormat = require('dateformat');

monthEndRouter.post("/fetch_monthend_branch_details", async (req, res) => {
    try {
      var select = "a.branch_code, a.branch_name, DATE_ADD(b.closed_upto, INTERVAL 1 MONTH) AS closed_upto",
        table_name =
          "md_branch a LEFT JOIN td_month_close b ON a.branch_code = b.branch_code",
        whr = `a.branch_code <> 100`,
        order = null;
  
      var branch_data = await db_Select(select, table_name, whr, order);
  
      res.send(branch_data);
    } catch (error) {
      console.error("Error fetching month-end branch details:", error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  });

monthEndRouter.post("/update_month_end_data", async (req, res) => {
    var data = req.body;
    console.log(data);
    
    const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

       try {
           if (data.month_end_dt && data.month_end_dt.length > 0) {
   
               for (let dt of data.month_end_dt) {
                console.log(dt,'dt');
                
                var brn_code_arr = data.month_end_dt.map(pdt => `'${pdt.branch_code}'`);
                console.log(brn_code_arr,'brn_code');
                
   
                   var table_name = "td_month_close",
                       fields = `close_flag = 'C', closed_by = '${data.closed_by}', closed_at = '${datetime}'`,
                       values = null,
                       whr = `branch_code IN (${brn_code_arr.join(',')}) AND closed_upto = '${dt.closed_upto}'`,
                       flag = 1;
   
                   var month_end_details_save = await db_Insert(table_name, fields, values, whr, flag);
               }
               res.send({ "suc": 1, "msg": "Month end done successfully" });
           } else {
               res.send({ "suc": 0, "msg": "No details provided" });
           }
       } catch (error) {
           console.error(error);
           res.send({ "suc": 0, "msg": "Error occurred", details: error });
       }
});

module.exports = {monthEndRouter}