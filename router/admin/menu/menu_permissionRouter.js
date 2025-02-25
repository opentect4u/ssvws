const { db_Select } = require('../../../model/mysqlModel');

const express = require('express'),
menu_permissionRouter = express.Router(),
dateFormat = require('dateformat');

menu_permissionRouter.post("/menu_permission", async (req, res) => {
  var data = req.body;

  var select = "a.user_type,a.grt,a.applications,a.search_member,a.groups,a.edit_group,a.add_group,a.transfer_group,a.approve_group_transfer,a.view_group_transfer,a.attendance,a.attendance_dashboard,a.loans,a.disburse_loan,a.view_loan,a.approve_transaction,a.reports,a.loan_statement,a.loan_transactions,a.demand_report,a.outstanding_report,a.fundwise_report,a.schemewise_report,a.demand_vs_collection,a.master,a.banks,a.employees,a.designation,a.user_management,a.create_user,a.manage_user,a.transfer_user,a.created_by,a.created_at,a.modified_by,a.modified_at,b.user_type user_type_name",
  table_name = "td_menu_permission a, md_user_type b",
  whr = `a.user_type = b.type_code`,
  order = null;
  var menu_dt = await db_Select(select,table_name,whr,order);
  res.send(menu_dt)
});

module.exports = {menu_permissionRouter}