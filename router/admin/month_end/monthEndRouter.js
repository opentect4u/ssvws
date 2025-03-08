const { db_Select, db_Insert } = require('../../../model/mysqlModel');

const express = require('express'),
monthEndRouter = express.Router(),
dateFormat = require('dateformat');

monthEndRouter.get("/get_branch_name_in_month_end_screen", async (req, res) => {
  var data = req.query;

  var select = "branch_code,branch_name",
  table_name = "md_branch",
  whr = null,
  order = null;
  var branch_data = await db_Select(select,table_name,whr,order);
  res.send(branch_data);
});

module.exports = {monthEndRouter}