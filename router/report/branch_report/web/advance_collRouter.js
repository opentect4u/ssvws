const { db_Select } = require('../../../../model/mysqlModel');

const express = require('express'),
advance_collRouter = express.Router(),
dateFormat = require('dateformat');

// advance collection report Groupwise
advance_collRouter.post("/advance_collection_report_groupwise", async (req, res) => {
 try{
  var data = req.body;
//   console.log(data,'group_data');

  // Get last and first dates of the selected month
  var date_query = `LAST_DAY(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01')) AS month_last_date`;
  var first_date_query = `STR_TO_DATE(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01'), '%Y-%m-%d') AS first_day_of_month`;
  
  var dateResult = await db_Select(date_query);
  var first_dateResult = await db_Select(first_date_query);
  
  var create_date = dateFormat(dateResult.msg[0].month_last_date, 'yyyy-mm-dd');
  var first_create_date = dateFormat(first_dateResult.msg[0].first_day_of_month, 'yyyy-mm-dd');

  var select = `DATE_FORMAT(a.payment_date, '%Y-%m-%d') payment_date,b.branch_code,e.branch_name,b.group_code,c.group_name,f.bank_name,f.branch_name bank_branch_name,c.acc_no1 sb_account,c.acc_no2 loan_account,c.grp_addr,c.co_id,d.emp_name co_name,SUM(a.credit) AS credit,SUM(a.prn_recov) AS prn_recov,SUM(a.intt_recov) AS intt_recov,SUM(b.prn_amt + b.od_prn_amt + b.intt_amt)curr_balance`,
  table_name = "td_loan_transactions a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_group c ON  b.group_code = c.group_code LEFT JOIN md_employee d ON c.co_id = d.emp_id LEFT JOIN md_branch e ON b.branch_code = e.branch_code LEFT JOIN md_bank f ON c.bank_name = f.bank_code",
  whr = `a.payment_date BETWEEN '${first_create_date}' AND '${create_date}' 
         AND a.loan_id IN (SELECT loan_id FROM td_loan
                   WHERE branch_code IN (${data.branch_code}))
         AND a.loan_id NOT IN (SELECT loan_id FROM td_loan_month_demand
                       WHERE branch_code IN (${data.branch_code})
                       AND demand_date = '${create_date}')
         AND a.tr_type = 'R'`,
  order = `GROUP BY a.payment_date,b.branch_code,e.branch_name,b.group_code,c.group_name,f.bank_name,f.branch_name,c.acc_no1,c.acc_no2,c.grp_addr,c.co_id,d.emp_name
             ORDER BY a.payment_date`;
  var advance_collec_grp_data = await db_Select(select,table_name,whr,order);
  res.send({advance_collec_grp_data});
 }catch(error){
    console.error("Error fetching advance collection report groupwise:", error);
    res.send({ suc: 0, msg: "An error occurred" });
 }
});

// advance collection report Fundwise
advance_collRouter.post("/advance_collection_report_fundwise", async (req, res) => {
 try{
  var data = req.body;
//   console.log(data,'fund_data');

   // Get last and first dates of the selected month
    var date_query = `LAST_DAY(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01')) AS month_last_date`;
    var first_date_query = `STR_TO_DATE(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01'), '%Y-%m-%d') AS first_day_of_month`;
  
    var dateResult = await db_Select(date_query);
    var first_dateResult = await db_Select(first_date_query);
  
    var create_date = dateFormat(dateResult.msg[0].month_last_date, 'yyyy-mm-dd');
    var first_create_date = dateFormat(first_dateResult.msg[0].first_day_of_month, 'yyyy-mm-dd');

  var select = `DATE_FORMAT(a.payment_date, '%Y-%m-%d') payment_date,b.branch_code,f.branch_name,b.group_code,c.group_name,g.bank_name,g.branch_name bank_branch_name,c.acc_no1 sb_account,c.acc_no2 loan_account,c.grp_addr,c.co_id,d.emp_name co_name,b.fund_id,e.fund_name,SUM(a.credit) AS credit,SUM(a.prn_recov) AS prn_recov,SUM(a.intt_recov) AS intt_recov,SUM(b.prn_amt + b.od_prn_amt + b.intt_amt)curr_balance`,
  table_name = "td_loan_transactions a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_group c ON  b.group_code = c.group_code LEFT JOIN md_employee d ON c.co_id = d.emp_id LEFT JOIN md_fund e ON b.fund_id = e.fund_id LEFT JOIN md_branch f ON b.branch_code = f.branch_code LEFT JOIN md_bank g ON c.bank_name = g.bank_code",
  whr = `a.payment_date BETWEEN '${first_create_date}' AND '${create_date}' 
         AND a.loan_id IN (SELECT loan_id FROM td_loan
                   WHERE branch_code IN (${data.branch_code}))
         AND a.loan_id NOT IN (SELECT loan_id FROM td_loan_month_demand
                       WHERE branch_code IN (${data.branch_code})
                       AND demand_date = '${create_date}')
         AND a.tr_type = 'R'
         AND b.fund_id IN (${data.fund_id})`,
  order = `GROUP BY a.payment_date,b.branch_code,f.branch_name,b.group_code,c.group_name,g.bank_name,g.branch_name,c.acc_no1,c.acc_no2,c.grp_addr,c.co_id,d.emp_name,b.fund_id,e.fund_name
             ORDER BY a.payment_date`;
  var advance_collec_fund_data = await db_Select(select,table_name,whr,order);
  res.send({advance_collec_fund_data});
 }catch(error){
    console.error("Error fetching advance collection report fundwise:", error);
    res.send({ suc: 0, msg: "An error occurred" });
 } 
});

// advance collection report COwise
advance_collRouter.post("/advance_collection_report_cowise", async (req, res) => {
 try{
  var data = req.body;
//   console.log(data,'co_data');

   // Get last and first dates of the selected month
    var date_query = `LAST_DAY(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01')) AS month_last_date`;
    var first_date_query = `STR_TO_DATE(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01'), '%Y-%m-%d') AS first_day_of_month`;
  
    var dateResult = await db_Select(date_query);
    var first_dateResult = await db_Select(first_date_query);
  
    var create_date = dateFormat(dateResult.msg[0].month_last_date, 'yyyy-mm-dd');
    var first_create_date = dateFormat(first_dateResult.msg[0].first_day_of_month, 'yyyy-mm-dd');

  var select = `DATE_FORMAT(a.payment_date, '%Y-%m-%d') payment_date,b.branch_code,f.branch_name,c.co_id,d.emp_name co_name,COUNT(DISTINCT c.group_code) AS total_group,COUNT(b.member_code) AS total_member,b.fund_id,e.fund_name,SUM(a.credit) AS credit,SUM(a.prn_recov) AS prn_recov,SUM(a.intt_recov) AS intt_recov,SUM(b.prn_amt + b.od_prn_amt + b.intt_amt)curr_balance`,
  table_name = "td_loan_transactions a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_group c ON b.group_code = c.group_code LEFT JOIN md_employee d ON c.co_id = d.emp_id LEFT JOIN md_fund e ON b.fund_id = e.fund_id LEFT JOIN md_branch f ON b.branch_code = f.branch_code",
  whr = `a.payment_date BETWEEN '${first_create_date}' AND '${create_date}' 
         AND a.loan_id IN (SELECT loan_id FROM td_loan
                   WHERE branch_code IN (${data.branch_code}))
         AND a.loan_id NOT IN (SELECT loan_id FROM td_loan_month_demand
                       WHERE branch_code IN (${data.branch_code})
                       AND demand_date = '${create_date}')
         AND a.tr_type = 'R'
         AND c.co_id IN (${data.co_id})`,
  order = `GROUP BY a.payment_date,b.branch_code,f.branch_name,c.co_id,d.emp_name,b.fund_id,e.fund_name
           ORDER BY a.payment_date`;
  var advance_collec_co_data = await db_Select(select,table_name,whr,order);
  res.send({advance_collec_co_data});
 }catch(error){
    console.error("Error fetching advance collection report cowise:", error);
    res.send({ suc: 0, msg: "An error occurred" });
 } 
});

// advance collection report Memberwise
advance_collRouter.post("/advance_collection_report_memberwise", async (req, res) => {
 try{
  var data = req.body;
//   console.log(data,'member_data');

   // Get last and first dates of the selected month
    var date_query = `LAST_DAY(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01')) AS month_last_date`;
    var first_date_query = `STR_TO_DATE(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01'), '%Y-%m-%d') AS first_day_of_month`;
  
    var dateResult = await db_Select(date_query);
    var first_dateResult = await db_Select(first_date_query);
  
    var create_date = dateFormat(dateResult.msg[0].month_last_date, 'yyyy-mm-dd');
    var first_create_date = dateFormat(first_dateResult.msg[0].first_day_of_month, 'yyyy-mm-dd');

  var select = `DATE_FORMAT(a.payment_date, '%Y-%m-%d') payment_date,b.branch_code,i.branch_name,b.loan_id,b.member_code,e.client_name,b.group_code,c.group_name,j.bank_name,j.branch_name bank_branch_name,c.acc_no1 sb_account,c.acc_no2 loan_account,c.grp_addr,c.co_id,d.emp_name,b.scheme_id,f.scheme_name,a.credit AS credit,a.prn_recov AS prn_recov,a.intt_recov AS intt_recov,(b.prn_amt + b.od_prn_amt + b.intt_amt)curr_balance,a.created_by created_code,a.created_at,g.emp_name created_by,a.approved_by approved_code,h.emp_name approved_by,a.approved_at`,
  table_name = "td_loan_transactions a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_group c ON b.group_code = c.group_code LEFT JOIN md_employee d ON c.co_id = d.emp_id LEFT JOIN md_member e ON b.member_code = e.member_code LEFT JOIN md_scheme f ON b.scheme_id = f.scheme_id LEFT JOIN md_employee g ON a.created_by = g.emp_id LEFT JOIN md_employee h ON a.approved_by = h.emp_id LEFT JOIN md_branch i ON b.branch_code = i.branch_code LEFT JOIN md_bank j ON c.bank_name = j.bank_code",
  whr = `a.payment_date BETWEEN '${first_create_date}' AND '${create_date}' 
         AND a.loan_id IN (SELECT loan_id FROM td_loan
                   WHERE branch_code IN (${data.branch_code}))
         AND a.loan_id NOT IN (SELECT loan_id FROM td_loan_month_demand
                       WHERE branch_code IN (${data.branch_code})
                       AND demand_date = '${create_date}')
         AND a.tr_type = 'R'`,
  order = `ORDER BY a.payment_date`;
  var advance_collec_member_data = await db_Select(select,table_name,whr,order);
  res.send({advance_collec_member_data});
 }catch(error){
    console.error("Error fetching advance collection report memberwise:", error);
    res.send({ suc: 0, msg: "An error occurred" });
 } 
});

//advance collection report Branchwise
advance_collRouter.post("/advance_collection_report_branchwise", async (req, res) => {
 try{
  var data = req.body;
//   console.log(data,'branch_data');

   // Get last and first dates of the selected month
    var date_query = `LAST_DAY(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01')) AS month_last_date`;
    var first_date_query = `STR_TO_DATE(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01'), '%Y-%m-%d') AS first_day_of_month`;
  
    var dateResult = await db_Select(date_query);
    var first_dateResult = await db_Select(first_date_query);
  
    var create_date = dateFormat(dateResult.msg[0].month_last_date, 'yyyy-mm-dd');
    var first_create_date = dateFormat(first_dateResult.msg[0].first_day_of_month, 'yyyy-mm-dd');

  var select = `a.branch_id,c.branch_name,SUM(a.credit) AS credit,SUM(a.prn_recov) AS prn_recov,SUM(a.intt_recov) AS intt_recov,SUM(b.prn_amt + b.od_prn_amt + b.intt_amt)curr_balance`,
  table_name = "td_loan_transactions a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_branch c ON a.branch_id = c.branch_code",
  whr = `a.payment_date BETWEEN '${first_create_date}' AND '${create_date}' 
         AND a.loan_id IN (SELECT loan_id FROM td_loan
                   WHERE branch_code IN (${data.branch_code}))
         AND a.loan_id NOT IN (SELECT loan_id FROM td_loan_month_demand
                       WHERE branch_code IN (${data.branch_code})
                       AND demand_date = '${create_date}')
         AND a.tr_type = 'R'`,
  order = `GROUP BY a.branch_id,c.branch_name`;
  var advance_collec_branch_data = await db_Select(select,table_name,whr,order);
  res.send({advance_collec_branch_data});
 }catch(error){
    console.error("Error fetching advance collection report branchwise:", error);
    res.send({ suc: 0, msg: "An error occurred" });
 } 
});
module.exports = { advance_collRouter }