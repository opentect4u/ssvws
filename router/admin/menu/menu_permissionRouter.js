const { db_Select, db_Insert } = require('../../../model/mysqlModel');

const express = require('express'),
menu_permissionRouter = express.Router(),
dateFormat = require('dateformat');

menu_permissionRouter.post("/fetch_menu_permission_dtls", async (req, res) => {
  var data = req.body;

  var select = "a.user_type,a.grt,a.applications,a.search_member,a.groups,a.edit_group,a.add_group,a.transfer_group,a.approve_group_transfer,a.view_group_transfer,a.attendance,a.attendance_dashboard,a.loans,a.disburse_loan,a.view_loan,a.approve_transaction,a.reports,a.loan_statement,a.loan_transactions,a.demand_report,a.outstanding_report,a.fundwise_report,a.schemewise_report,a.demand_vs_collection,a.master,a.banks,a.employees,a.designation,a.user_management,a.create_user,a.manage_user,a.transfer_user,a.created_by,a.created_at,a.modified_by,a.modified_at,b.user_type user_type_name",
  table_name = "td_menu_permission a, md_user_type b",
  whr = `a.user_type = b.type_code AND a.user_type = '${data.user_type}'`,
  order = null;
  var menu_dt = await db_Select(select,table_name,whr,order);
  res.send(menu_dt)
});

menu_permissionRouter.post("/menu_permission", async (req, res) => {
    try{
    let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var data = req.body;

    var select = "COUNT(user_type) user_type_no",
    table_name = "td_menu_permission",
    whr = `user_type = '${data.user_type}'`,
    order = null;
    var count_user_type = await db_Select(select,table_name,whr,order);
    count_user_type["user_type_no"] = user_type_no;


    if(count_user_type.suc > 0 && count_user_type.msg.length > 0){
        var data = req.body;

        var table_name = "td_menu_permission",
        fields = data.user_type > 0 ? `grt = '${data.grt}', applications = '${data.applications}', search_member = '${data.search_member}',search_member = '${data.search_member}', groups = '${data.groups}', edit_group = '${data.edit_group}', add_group = '${data.add_group}', transfer_group = '${data.transfer_group}', approve_group_transfer = '${data.approve_group_transfer}', view_group_transfer = '${data.view_group_transfer}', attendance = '${data.attendance}', attendance_dashboard = '${data.attendance_dashboard}', loans = '${data.loans}', disburse_loan = '${data.disburse_loan}', view_loan = '${data.view_loan}', approve_transaction = '${data.approve_transaction}', reports = '${data.reports}', loan_statement = '${data.loan_statement}', loan_transactions = '${data.loan_transactions}', demand_report = '${data.demand_report}', outstanding_report = '${data.outstanding_report}', fundwise_report = '${data.fundwise_report}', schemewise_report = '${data.schemewise_report}', demand_vs_collection = '${data.demand_vs_collection}', master = '${data.master}', banks = '${data.banks}', employees = '${data.employees}', designation = '${data.designation}', user_management = '${data.user_management}', create_user = '${data.create_user}', manage_user = '${data.manage_user}', transfer_user = '${data.transfer_user}', modified_by = '${data.modified_by}', modified_at = '${datetime}'` : `(user_type,grt,applications,search_member,groups,edit_group,add_group,transfer_group,approve_group_transfer,view_group_transfer,attendance,attendance_dashboard,loans,disburse_loan,view_loan,approve_transaction,reports,loan_statement,loan_transactions,demand_report,outstanding_report,fundwise_report,schemewise_report,demand_vs_collection,master,banks,employees,designation,user_management,create_user,manage_user,transfer_user,created_by,created_at)`,
        values = `('${data.user_type}','${data.grt}','${data.applications}','${data.search_member}','${data.groups}','${data.edit_group}','${data.add_group}','${data.transfer_group}','${data.approve_group_transfer}','${data.view_group_transfer}','${data.attendance}','${data.attendance_dashboard}','${data.loans}','${data.disburse_loan}','${data.view_loan}','${data.approve_transaction}','${data.reports}','${data.loan_statement}','${data.loan_transactions}','${data.demand_report}','${data.outstanding_report}','${data.fundwise_report}','${data.schemewise_report}','${data.demand_vs_collection}','${data.master}','${data.banks}','${data.employees}','${data.designation}','${data.user_management}','${data.create_user}','${data.manage_user}','${data.transfer_user}','${data.created_by}','${datet}')`,
        whr = data.user_type > 0 ? `user_type = '${data.user_type}'` : null,
        flag = data.user_type > 0 ? 1 : 0;
        var menu_permission_data = await db_Insert(table_name,fields,values,whr,flag);
    }
    res.send({"suc" : 1, "msg":"menu permission solved successfully", menu_permission_data})
  } catch (error) {
    console.log(error);
  }
});

module.exports = {menu_permissionRouter}