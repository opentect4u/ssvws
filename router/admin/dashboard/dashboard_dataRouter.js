const { db_Select } = require('../../../model/mysqlModel');

const express = require('express'),
dashboard_dataRouter = express.Router(),
dateFormat = require('dateformat');

//date of operation
dashboard_dataRouter.post("/date_of_operation", async (req, res) => {
  try {
    var data = req.body;
    

    var select = "DATE_FORMAT(LAST_DAY(DATE_ADD(closed_upto, INTERVAL 1 MONTH)), '%M %Y') AS date_of_operation",
    table_name = "td_month_close",
    whr = `branch_code = '${data.branch_code}'`,
    order = null;
    var operation_date = await db_Select(select,table_name,whr,order);
    res.send({
      suc : 1,
      data : {
        date_of_operation : operation_date.msg[0].date_of_operation
      }
    })
  }catch(error){
    console.error("Error fetching Date of operation:", error);
    res.send({ suc: 0, msg: "An error occurred" });
  }
});

// Dashboard total grt details today and this month (unapproved,approved,send to mis,rejected)
dashboard_dataRouter.post("/dashboard_tot_grt_details", async (req, res) => {
 try{
   var data = req.body;
  //  console.log(data,'dashboard');

    // Get today date
    const current_date = dateFormat(new Date(), "yyyy-mm-dd");
    // console.log(current_date,'date');

    const startOfMonth = dateFormat(new Date(new Date().getFullYear(), new Date().getMonth(), 1), "yyyy-mm-dd");
    // console.log(startOfMonth,'startOfMonth');
    
    let tot_pending, tot_send_mis, tot_approved, tot_rejected;
 
    if(data.flag == 'Today'){
    // Get data how many unapproved today
    tot_pending = await db_Select("COUNT(*)tot_pending","td_grt_basic",`grt_date = '${current_date}' AND branch_code IN (${data.branch_code}) AND approval_status = 'U'`,null);
    // Get data how many send to mis today
    tot_send_mis = await db_Select("COUNT(*)tot_send_mis","td_grt_basic",`modified_at = '${current_date}' AND branch_code IN (${data.branch_code}) AND approval_status = 'S'`,null);
    // Get data how many approved today
    tot_approved = await db_Select("COUNT(*)tot_approved","td_grt_basic",`approved_at = '${current_date}' AND branch_code IN (${data.branch_code}) AND approval_status = 'A'`,null);
    // Get data how many rejected today
    tot_rejected = await db_Select("COUNT(*)tot_rejected","td_grt_basic",`rejected_at = '${current_date}' AND branch_code IN (${data.branch_code}) AND approval_status = 'R'`,null);
    }else {

    // Get data how many unapproved this month
    tot_pending = await db_Select("COUNT(*)tot_pending","td_grt_basic",`grt_date BETWEEN '${startOfMonth}' AND '${current_date}' AND branch_code IN (${data.branch_code}) AND approval_status = 'U'`,null);
    // console.log(tot_pending,'tot_pending');
    
    // Get data how many send to mis this month
    tot_send_mis = await db_Select("COUNT(*)tot_send_mis","td_grt_basic",`modified_at BETWEEN '${startOfMonth}' AND '${current_date}' AND branch_code IN (${data.branch_code}) AND approval_status = 'S'`,null);
    // console.log(tot_send_mis,'tot_send_mis');

    // Get data how many approved this month
    tot_approved = await db_Select("COUNT(*)tot_approved","td_grt_basic",`approved_at BETWEEN '${startOfMonth}' AND '${current_date}' AND branch_code IN (${data.branch_code}) AND approval_status = 'A'`,null);
    // Get data how many rejected this month
    tot_rejected = await db_Select("COUNT(*)tot_rejected","td_grt_basic",`rejected_at BETWEEN '${startOfMonth}' AND '${current_date}' AND branch_code IN (${data.branch_code}) AND approval_status = 'R'`,null);
    }
    res.send({
      suc: 1,
      data: {
        tot_pending: tot_pending.msg[0].tot_pending || 0,
        tot_send_mis: tot_send_mis.msg[0].tot_send_mis || 0,
        tot_approved: tot_approved.msg[0].tot_approved || 0,
        tot_rejected: tot_rejected.msg[0].tot_rejected || 0
      }
    });
 }catch(error){
    console.error("Error fetching dashboard_details:", error);
    res.send({ suc: 0, msg: "An error occurred" });
 }
});

// Dashboard total active group details
dashboard_dataRouter.post("/dashboard_active_group", async (req, res) => {
 try{
   var data = req.body;
  //  console.log(data,'grp');
   
   let tot_group,total_group;

    tot_group = await db_Select("COUNT(*)tot_active_grp","md_group",`branch_code IN (${data.branch_code}) AND open_close_flag = 'O' AND approval_status = 'A'`,null);

    total_group = await db_Select("COUNT(*)toal_grp","md_group",`branch_code IN (${data.branch_code})`,null);
     res.send({
      suc: 1,
      data: {
        tot_active_grp: tot_group.msg[0].tot_active_grp || 0,
        tot_group: total_group.msg[0].toal_grp || 0,
      }
    });
 }catch(error){
    console.error("Error fetching dashboard_active_group:", error);
    res.send({ suc: 0, msg: "An error occurred" });
 }
});

// Dashboard total user_logged_in details today
dashboard_dataRouter.post("/dshboard_user_logged_in_details", async (req, res) => {
    try{
      var data = req.body;
      // console.log(data,'data_logged');

      const current_date = dateFormat(new Date(), "yyyy-mm-dd");

      let tot_active_user, active_user_dtls;

      tot_active_user = await db_Select("COUNT(*)tot_active_user","md_user",`brn_code IN (${data.branch_code}) AND user_status = 'A' AND date(created_at) = '${current_date}' AND refresh_token != '' AND session_id != ''`,null);

       var select = "a.emp_id,b.emp_name,a.user_status",
       table_name = "md_user a LEFT JOIN md_employee b ON a.emp_id = b.emp_id",
      whr = `a.brn_code IN (${data.branch_code}) AND a.user_status = 'A' AND date(a.created_at) = '${current_date}' AND a.refresh_token != '' AND a.session_id != ''`,
      order = null;
      active_user_dtls = await db_Select(select,table_name,whr,order);

     res.send({
      suc: 1,
      data: {
        tot_user_active: tot_active_user.msg[0].tot_active_user || 0,
        active_user: active_user_dtls.msg || [],
      }
    });
    }catch(error){
    console.error("Error fetching dshboard_user_logged_in_details:", error);
    res.send({ suc: 0, msg: "An error occurred" });
 }
});

// Dashboard total loan disbursed and total group disbursed details today and this month
dashboard_dataRouter.post("/dashboard_tot_loan_disbursed_dtls", async (req, res) => {
 try{
  var data = req.body;
  // console.log(data,'data_d_loan');

  const current_date = dateFormat(new Date(), "yyyy-mm-dd");
  const startOfMonth = dateFormat(new Date(new Date().getFullYear(), new Date().getMonth(), 1), "yyyy-mm-dd");
  // console.log(startOfMonth,'startOfMonthda');

  let tot_loan_disbursed,tot_grp_disbursed;

  if(data.flag == 'Today'){
 //total loan disbursed details today
   var select = "SUM(debit)tot_loan_disb",
   table_name = "td_loan_transactions",
   whr = `payment_date = '${current_date}' AND branch_id IN (${data.branch_code}) AND tr_type = 'D'`,
   order = null;
  tot_loan_disbursed = await db_Select(select,table_name,whr,order);

  //total group loan disbursed details today
  var select = "COUNT(a.group_code)tot_grp_disb",
  table_name = "td_loan a LEFT JOIN td_loan_transactions b ON a.loan_id = b.loan_id",
  whr = `a.branch_code IN (${data.branch_code}) AND b.tr_type = 'D' AND b.payment_date = '${current_date}'`,
  order = null;
  tot_grp_disbursed = await db_Select(select,table_name,whr,order);
  }else {
//total loan disbursed details this month
   var select = "SUM(debit)tot_loan_disb",
   table_name = "td_loan_transactions",
   whr = `payment_date BETWEEN '${startOfMonth}' AND '${current_date}' AND branch_id IN (${data.branch_code}) AND tr_type = 'D'`,
   order = null;
   tot_loan_disbursed = await db_Select(select,table_name,whr,order);

  //total group loan disbursed details this month
  var select = "COUNT(a.group_code)tot_grp_disb",
  table_name = "td_loan a LEFT JOIN td_loan_transactions b ON a.loan_id = b.loan_id",
  whr = `a.branch_code IN (${data.branch_code}) AND b.tr_type = 'D' AND b.payment_date BETWEEN '${startOfMonth}' AND '${current_date}'`,
  order = null;
  tot_grp_disbursed = await db_Select(select,table_name,whr,order);
  }
   res.send({
      suc: 1,
      data: {
        total_loan_disbursed: tot_loan_disbursed.msg[0].tot_loan_disb || 0,
        total_grp_loan_disbursed: tot_grp_disbursed.msg[0].tot_grp_disb || 0,
      }
    });
 }catch(error){
    console.error("Error fetching dshboard total loan disbursed details:", error);
    res.send({ suc: 0, msg: "An error occurred" });
 }
});

// Dashboard total loan recovery and total group recovery details today and this month
dashboard_dataRouter.post("/dashboard_tot_loan_recov_dtls", async (req, res) => {
 try{
   var data = req.body;
  // console.log(data,'data_r_loan');

  const current_date = dateFormat(new Date(), "yyyy-mm-dd");
  const startOfMonth = dateFormat(new Date(new Date().getFullYear(), new Date().getMonth(), 1), "yyyy-mm-dd");
  // console.log(startOfMonth,'startOfMonthrec');

  let tot_loan_recovery,tot_grp_recovery;

  if(data.flag == 'Today'){
 //total loan disbursed details today
   var select = "SUM(credit)tot_loan_recov",
   table_name = "td_loan_transactions",
   whr = `payment_date = '${current_date}' AND branch_id IN (${data.branch_code}) AND tr_type = 'R'`,
   order = null;
  tot_loan_recovery = await db_Select(select,table_name,whr,order);

  //total group loan disbursed details today
  var select = "COUNT(a.group_code)tot_grp_recov",
  table_name = "td_loan a LEFT JOIN td_loan_transactions b ON a.loan_id = b.loan_id",
  whr = `a.branch_code IN (${data.branch_code}) AND b.tr_type = 'R' AND b.payment_date = '${current_date}'`,
  order = null;
  tot_grp_recovery = await db_Select(select,table_name,whr,order);
  }else {
//total loan disbursed details this month
   var select = "SUM(credit)tot_loan_recov",
   table_name = "td_loan_transactions",
   whr = `payment_date BETWEEN '${startOfMonth}' AND '${current_date}' AND branch_id IN (${data.branch_code}) AND tr_type = 'R'`,
   order = null;
   tot_loan_recovery = await db_Select(select,table_name,whr,order);

  //total group loan disbursed details this month
  var select = "COUNT(a.group_code)tot_grp_recov",
  table_name = "td_loan a LEFT JOIN td_loan_transactions b ON a.loan_id = b.loan_id",
  whr = `a.branch_code IN (${data.branch_code}) AND b.tr_type = 'R' AND b.payment_date BETWEEN '${startOfMonth}' AND '${current_date}'`,
  order = null;
  tot_grp_recovery = await db_Select(select,table_name,whr,order);
  }
   res.send({
      suc: 1,
      data: {
        total_loan_recovery: tot_loan_recovery.msg[0].tot_loan_recov || 0,
        total_grp_loan_recovery: tot_grp_recovery.msg[0].tot_grp_recov || 0,
      }
    });
 }catch(error){
    console.error("Error fetching dshboard total loan recovery details:", error);
    res.send({ suc: 0, msg: "An error occurred" });
 }
});

// Dashboard total loan unapprove and total group unapprove details today and this month
dashboard_dataRouter.post("/dashboard_tot_loan_unapprove_dtls", async (req, res) => {
 try{
    var data = req.body;
    // console.log(data,'data_un_loan');

    const current_date = dateFormat(new Date(), "yyyy-mm-dd");
    const startOfMonth = dateFormat(new Date(new Date().getFullYear(), new Date().getMonth(), 1), "yyyy-mm-dd");

    let tot_loan_unapprove,tot_grp_unapprove;

    if(data.flag == 'Today'){
    //total loan unapprove details today
    var select = "SUM(debit + credit)tot_unapprove_loan",
    table_name = "td_loan_transactions",
    whr = `payment_date = '${current_date}' AND branch_id IN (${data.branch_code}) AND status = 'U' AND tr_type IN('D','R')`,
    order = null;
    tot_loan_unapprove = await db_Select(select,table_name,whr,order);

    //total group loan unapprove details today
    var select = "COUNT(a.group_code)tot_unapprove_grp",
    table_name = "td_loan a LEFT JOIN td_loan_transactions b ON a.loan_id = b.loan_id",
    whr = `a.branch_code IN (${data.branch_code}) AND b.status = 'U' AND b.payment_date = '${current_date}' AND b.tr_type IN('D','R')`,
    order = null;
    tot_grp_unapprove = await db_Select(select,table_name,whr,order);
  }else {
    //total loan unapprove details this month
    var select = "SUM(debit + credit)tot_unapprove_loan",
    table_name = "td_loan_transactions",
    whr = `payment_date BETWEEN '${startOfMonth}' AND '${current_date}' AND branch_id IN (${data.branch_code}) AND status = 'U' AND tr_type IN('D','R')`,
    order = null;
    tot_loan_unapprove = await db_Select(select,table_name,whr,order);

    //total group loan unapprove details this month
    var select = "COUNT(a.group_code)tot_unapprove_grp",
    table_name = "td_loan a LEFT JOIN td_loan_transactions b ON a.loan_id = b.loan_id",
    whr = `a.branch_code IN (${data.branch_code}) AND b.status = 'U' AND b.payment_date BETWEEN '${startOfMonth}' AND '${current_date}' AND tr_type IN('D','R')`,
    order = null;
    tot_grp_unapprove = await db_Select(select,table_name,whr,order);
  }
  res.send({
    suc: 1,
    data : {
      total_loan_unapprove: tot_loan_unapprove.msg[0].tot_unapprove_loan || 0,
      total_group_unapprove: tot_grp_unapprove.msg[0].tot_unapprove_grp || 0,
    }
  })
 }catch(error){
    console.error("Error fetching dshboard total loan unapprove details:", error);
    res.send({ suc: 0, msg: "An error occurred" });
 }
});

module.exports = {dashboard_dataRouter}