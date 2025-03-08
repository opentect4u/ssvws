const { db_Select, db_Insert } = require('../../../model/mysqlModel');

const express = require('express'),
monthEndRouter = express.Router(),
dateFormat = require('dateformat');

monthEndRouter.post("/get_branch_name_in_month_end_screen", async (req, res) => {
  var data = req.body;

  var select = "a.branch_code,a.branch_name,b.closed_upto",
  table_name = "md_branch a LEFT JOIN td_month_close b ON a.branch_code = b.branch_code",
  whr = null,
  order = null;
  var branch_data = await db_Select(select,table_name,whr,order);
  res.send(branch_data);
});

module.exports = {monthEndRouter}