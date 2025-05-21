const { db_Select, db_RunProcedureAndFetchData } = require('../../../../model/mysqlModel');

const express = require('express'),
dmd_vs_collRouter = express.Router(),
dateFormat = require('dateformat');

// //DEMAND VS COLLECTION REPORT MEMBERWISE
// dmd_vs_collRouter.post("/dmd_vs_collec_report_memberwise", async (req, res) => {
//     try {
//         var data = req.body;
//         const pro_name = 'p_loan_demand',
//         pro_params = `?,?,?`,
//         pro_params_val = [data.from_dt, data.to_dt, data.branch_code],
//         sel_table_name = `tt_loan_demand a,vw_loan_demand_report b`,
//         sel_fields = `a.loan_id,a.member_code,b.client_name,a.group_code,b.group_name,a.disbursed_date,a.disbursed_amount,a.current_roi,a.period,a.period_mode,a.recov_day,a.installment_end_date,a.total_emi,(a.curr_dmd_amt + a.coll_amt)previous_demand,a.curr_dmd_amt current_demand ,a.coll_amt,a.current_principal,b.co_name`,
//         sel_whr_fields = `a.loan_id = b.loan_id AND (a.curr_dmd_amt + a.coll_amt + a.current_principal) > 0`,
//         sel_whr_arr = [],
//         sel_order = `ORDER BY  a.loan_id`;
//         var repo_data = await db_RunProcedureAndFetchData(pro_name, pro_params, pro_params_val, sel_fields, sel_table_name, sel_whr_fields, sel_whr_arr, sel_order);

//         res.send(repo_data)

//     } catch (error) {
//         console.error("Error fetching demand vs collection report memberwise:", error);
//         res.send({ suc: 0, msg: "An error occurred" });
//     }
// });

// //DEMAND VS COLLECTION REPORT GROUPWISE
// dmd_vs_collRouter.post("/dmd_vs_collec_report_groupwise", async (req, res) => {
//     try {
//         var data = req.body;
//         const pro_name = 'p_loan_demand',
//         pro_params = `?,?,?`,
//         pro_params_val = [data.from_dt, data.to_dt, data.branch_code],
//         sel_table_name = `tt_loan_demand a,vw_loan_demand_report b`,
//         sel_fields = `a.group_code,b.group_name,a.disbursed_date,sum(a.disbursed_amount)disbursed_amount,
//         a.current_roi,a.period,a.period_mode,a.installment_end_date,sum(a.total_emi)total_emi,sum(a.curr_dmd_amt + a.coll_amt)previous_demand,sum(a.curr_dmd_amt) current_demand ,sum(a.coll_amt)coll_amt,sum(a.current_principal)outstanding,b.co_name`,
//         sel_whr_fields = `a.loan_id = b.loan_id AND (a.curr_dmd_amt + a.coll_amt + a.current_principal) > 0`,
//         sel_whr_arr = [],
//         sel_order = `GROUP BY a.group_code,b.group_name,a.disbursed_date,a.current_roi,a.period,a.period_mode,a.installment_end_date,b.co_name`;
//         var repo_data_grpwise = await db_RunProcedureAndFetchData(pro_name, pro_params, pro_params_val, sel_fields, sel_table_name, sel_whr_fields, sel_whr_arr, sel_order);

//         res.send(repo_data_grpwise)

//     } catch (error) {
//         console.error("Error fetching demand vs collection report groupwise:", error);
//         res.send({ suc: 0, msg: "An error occurred" });
//     }
// });

// //DEMAND VS COLLECTION REPORT COWISE
// dmd_vs_collRouter.post("/dmd_vs_collec_report_cowise", async (req, res) => {
//     try {
//         var data = req.body;
//         const pro_name = 'p_loan_demand',
//         pro_params = `?,?,?`,
//         pro_params_val = [data.from_dt, data.to_dt, data.branch_code],
//         sel_table_name = `tt_loan_demand a,vw_loan_demand_report b`,
//         sel_fields = `a.loan_id,a.member_code,b.client_name,a.group_code,b.group_name,a.disbursed_date,a.disbursed_amount,a.current_roi,a.period,a.period_mode,a.recov_day,a.installment_end_date,a.total_emi,(a.curr_dmd_amt + a.coll_amt)previous_demand,a.curr_dmd_amt current_demand ,a.coll_amt,a.current_principal,b.co_name,b.collec_code`,
//         sel_whr_fields = `a.loan_id = b.loan_id AND b.collec_code = '${data.co_id}' AND (a.curr_dmd_amt + a.coll_amt + a.current_principal) > 0`,
//         sel_whr_arr = [],
//         sel_order = `ORDER BY  a.loan_id`;
//         var repo_data_cowise = await db_RunProcedureAndFetchData(pro_name, pro_params, pro_params_val, sel_fields, sel_table_name, sel_whr_fields, sel_whr_arr, sel_order);

//         res.send(repo_data_cowise)

//     } catch (error) {
//         console.error("Error fetching demand vs collection report cowise:", error);
//         res.send({ suc: 0, msg: "An error occurred" });
//     }
// });

//DEMAND VS COLLECTION REPORT GROUPWISE

// dmd_vs_collRouter.post("/dmd_vs_collec_report_groupwise", async (req, res) => {
//    try {
//      var data = req.body;
 
//      // Get last and first dates of the selected month
//      var date_query = `LAST_DAY(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01')) AS month_last_date`;
//      var first_date_query = `STR_TO_DATE(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01'), '%Y-%m-%d') AS first_day_of_month`;
 
//      var dateResult = await db_Select(date_query);
//      var first_dateResult = await db_Select(first_date_query);
 
//      var create_date = dateFormat(dateResult.msg[0].month_last_date, 'yyyy-mm-dd');
//      var first_create_date = dateFormat(first_dateResult.msg[0].first_day_of_month, 'yyyy-mm-dd');
     
//      var select = ` 
//        DATE_FORMAT(demand_date, '%M %Y') AS demand_date,CONCAT(STR_TO_DATE('${first_create_date}', '%Y-%m-%d'), ' to ', STR_TO_DATE('${create_date}', '%Y-%m-%d')) AS "collec between",
//        branch_code, branch_name,
//        group_code, group_name,
//        co_id, emp_name,
//        disb_dt, SUM(disb_amt)disb_amt, curr_roi, loan_period, period_mode,
//        instl_start_dt, instl_end_dt,
//        SUM(tot_emi)tot_emi,SUM(coll_amt)coll_amt,SUM(demand_amt)demand_after_collection,SUM(curr_outstanding)curr_outstanding
//      FROM (
//        SELECT 
//          a.demand_date,a.branch_code,c.branch_name,
//          b.group_code, d.group_name, d.co_id, e.emp_name,
//          b.disb_dt, SUM(b.prn_disb_amt) AS disb_amt,
//          b.curr_roi, b.period AS loan_period, b.period_mode,
//          b.instl_start_dt,b.instl_end_dt,
//          SUM(b.tot_emi) AS tot_emi, SUM(a.dmd_amt) AS demand_amt,
//          0 AS coll_amt, SUM(b.outstanding) AS curr_outstanding
//        FROM td_loan_month_demand a
//        LEFT JOIN td_loan b ON a.branch_code = b.branch_code AND a.loan_id = b.loan_id
//        LEFT JOIN md_branch c ON a.branch_code = c.branch_code
//        LEFT JOIN md_group d ON b.group_code = d.group_code
//        LEFT JOIN md_employee e ON d.co_id = e.emp_id
//        WHERE a.branch_code IN (${data.branch_code})
//          AND a.demand_date = '${create_date}'
//        GROUP BY a.demand_date, a.branch_code, c.branch_name,
//          b.group_code, d.group_name, d.co_id, e.emp_name,b.disb_dt,
//          b.curr_roi, b.period, b.period_mode,b.instl_start_dt,b.instl_end_dt
         
//        UNION
       
//        SELECT 
//          a.demand_date,a.branch_code, c.branch_name,
//          b.group_code, d.group_name, d.co_id, e.emp_name,
//          b.disb_dt, 0 AS disb_amt,
//          b.curr_roi, b.period AS loan_period, b.period_mode,b.instl_start_dt,b.instl_end_dt,
//          0 AS tot_emi, 0 AS demand_amt,
//          IFNULL(SUM(f.credit), 0) AS coll_amt, 0 AS curr_outstanding
//        FROM td_loan_month_demand a
//        LEFT JOIN td_loan b ON a.branch_code = b.branch_code AND a.loan_id = b.loan_id
//        LEFT JOIN md_branch c ON a.branch_code = c.branch_code
//        LEFT JOIN md_group d ON b.group_code = d.group_code
//        LEFT JOIN md_employee e ON d.co_id = e.emp_id
//        LEFT JOIN td_loan_transactions f ON a.loan_id = f.loan_id
//        WHERE a.branch_code IN (${data.branch_code})
//          AND a.demand_date = '${create_date}'
//          AND f.payment_date BETWEEN '${first_create_date}' AND '${create_date}'
//        GROUP BY a.demand_date, a.branch_code, c.branch_name,
//          b.group_code, d.group_name, d.co_id, e.emp_name,b.disb_dt,
//          b.curr_roi, b.period, b.period_mode,b.instl_start_dt,b.instl_end_dt
//      ) a
//         GROUP BY demand_date,branch_code,branch_name,group_code,group_name,co_id,emp_name,disb_dt,curr_roi,loan_period,period_mode,instl_start_dt,instl_end_dt
//       ORDER BY group_code
//    `;
 
//      var groupwise_demand_collec_data = await db_Select(select,null,null,null);
//      res.send({
//        groupwise_demand_collec_data,
//        dateRange: `BETWEEN '${first_create_date}' AND '${create_date}'`
//      });
//    } catch (error) {
//      console.error("Error fetching demand vs collection report groupwise:", error);
//      res.send({ suc: 0, msg: "An error occurred" });
//    }
//  });
 
dmd_vs_collRouter.post("/dmd_vs_collec_report_groupwise", async (req, res) => {
  try {
    var data = req.body;

    // Get last and first dates of the selected month
    var date_query = `LAST_DAY(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01')) AS month_last_date`;
    var first_date_query = `STR_TO_DATE(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01'), '%Y-%m-%d') AS first_day_of_month`;

    var dateResult = await db_Select(date_query);
    var first_dateResult = await db_Select(first_date_query);

    var create_date = dateFormat(dateResult.msg[0].month_last_date, 'yyyy-mm-dd');
    var first_create_date = dateFormat(first_dateResult.msg[0].first_day_of_month, 'yyyy-mm-dd');
    
    var select = ` 
      DATE_FORMAT(demand_date, '%M %Y') AS demand_date,CONCAT(STR_TO_DATE('${first_create_date}', '%Y-%m-%d'), ' to ', STR_TO_DATE('${create_date}', '%Y-%m-%d')) AS "collec between",
      branch_code, branch_name,
      group_code, group_name,
      co_id, emp_name,
      disb_dt, SUM(disb_amt)disb_amt, curr_roi, loan_period, period_mode,recovery_day_calc AS recovery_day,
      instl_start_dt, instl_end_dt,
      SUM(tot_emi)tot_emi,SUM(coll_amt)coll_amt,SUM(demand_amt)demand_after_collection,SUM(curr_outstanding)curr_outstanding
    FROM (
      SELECT 
        a.demand_date,a.branch_code,c.branch_name,
        a.group_code, d.group_name, d.co_id, e.emp_name,
        b.disb_dt, SUM(b.prn_disb_amt) AS disb_amt,
        b.curr_roi, b.period AS loan_period, b.period_mode,
        CASE 
        WHEN b.period_mode = 'Monthly' THEN b.recovery_day
        WHEN b.period_mode = 'Weekly' THEN 
        CASE b.recovery_day
        WHEN 1 THEN 'Sunday'
        WHEN 2 THEN 'Monday'
        WHEN 3 THEN 'Tuesday'
        WHEN 4 THEN 'Wednesday'
        WHEN 5 THEN 'Thursday'
        WHEN 6 THEN 'Friday'
        WHEN 7 THEN 'Saturday'
        ELSE 'Unknown'
        END
        ELSE 'N/A'
        END AS recovery_day_calc,
        b.instl_start_dt,b.instl_end_dt,
        SUM(b.tot_emi) AS tot_emi, SUM(a.dmd_amt) AS demand_amt,
        0 AS coll_amt, SUM(a.prn_amt + a.intt_amt) AS curr_outstanding
      FROM tt_loan_demand a
      LEFT JOIN td_loan b ON a.branch_code = b.branch_code AND a.loan_id = b.loan_id
      LEFT JOIN md_branch c ON a.branch_code = c.branch_code
      LEFT JOIN md_group d ON a.group_code = d.group_code
      LEFT JOIN md_employee e ON d.co_id = e.emp_id
      WHERE a.branch_code IN (${data.branch_code})
      GROUP BY a.demand_date, a.branch_code, c.branch_name,
        a.group_code, d.group_name, d.co_id, e.emp_name,b.disb_dt,
        b.curr_roi, b.period, b.period_mode,b.recovery_day,b.instl_start_dt,b.instl_end_dt
        
      UNION
      
      SELECT 
        a.demand_date,a.branch_code, c.branch_name,
        a.group_code, d.group_name, d.co_id, e.emp_name,
        b.disb_dt, 0 AS disb_amt,
        b.curr_roi, b.period AS loan_period, b.period_mode,
        CASE 
        WHEN b.period_mode = 'Monthly' THEN b.recovery_day
        WHEN b.period_mode = 'Weekly' THEN 
        CASE b.recovery_day
        WHEN 1 THEN 'Sunday'
        WHEN 2 THEN 'Monday'
        WHEN 3 THEN 'Tuesday'
        WHEN 4 THEN 'Wednesday'
        WHEN 5 THEN 'Thursday'
        WHEN 6 THEN 'Friday'
        WHEN 7 THEN 'Saturday'
        ELSE 'Unknown'
        END
        ELSE 'N/A'
        END AS recovery_day_calc,b.instl_start_dt,b.instl_end_dt,
        0 AS tot_emi, 0 AS demand_amt,
        IFNULL(SUM(f.credit), 0) AS coll_amt, 0 AS curr_outstanding
      FROM tt_loan_demand a
      LEFT JOIN td_loan b ON a.branch_code = b.branch_code AND a.loan_id = b.loan_id
      LEFT JOIN md_branch c ON a.branch_code = c.branch_code
      LEFT JOIN md_group d ON a.group_code = d.group_code
      LEFT JOIN md_employee e ON d.co_id = e.emp_id
      LEFT JOIN td_loan_transactions f ON a.loan_id = f.loan_id
      WHERE a.branch_code IN (${data.branch_code})
      AND f.payment_date BETWEEN '${first_create_date}' AND '${create_date}'
      GROUP BY a.demand_date, a.branch_code, c.branch_name,
        a.group_code, d.group_name, d.co_id, e.emp_name,b.disb_dt,
        b.curr_roi, b.period, b.period_mode,b.recovery_day,b.instl_start_dt,b.instl_end_dt
    ) a
       GROUP BY demand_date,branch_code,branch_name,group_code,group_name,co_id,emp_name,disb_dt,curr_roi,loan_period,period_mode,recovery_day_calc AS recovery_day,instl_start_dt,instl_end_dt
     ORDER BY group_code
  `;

    var groupwise_demand_collec_data = await db_Select(select,null,null,null);
    res.send({
      groupwise_demand_collec_data,
      dateRange: `BETWEEN '${first_create_date}' AND '${create_date}'`
    });
  } catch (error) {
    console.error("Error fetching demand vs collection report groupwise:", error);
    res.send({ suc: 0, msg: "An error occurred" });
  }
});

//DEMAND VS COLLECTION REPORT FUNDWISE

dmd_vs_collRouter.post("/dmd_vs_collec_report_fundwise", async (req, res) => {
   try {
     var data = req.body;
 
     // Get last and first dates of the selected month
     var date_query = `LAST_DAY(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01')) AS month_last_date`;
     var first_date_query = `STR_TO_DATE(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01'), '%Y-%m-%d') AS first_day_of_month`;
 
     var dateResult = await db_Select(date_query);
     var first_dateResult = await db_Select(first_date_query);
 
     var create_date = dateFormat(dateResult.msg[0].month_last_date, 'yyyy-mm-dd');
     var first_create_date = dateFormat(first_dateResult.msg[0].first_day_of_month, 'yyyy-mm-dd');
     
     var select = ` 
       DATE_FORMAT(demand_date, '%M %Y') AS demand_date,CONCAT(STR_TO_DATE('${first_create_date}', '%Y-%m-%d'), ' to ', STR_TO_DATE('${create_date}', '%Y-%m-%d')) AS collec_upto,
       branch_code, branch_name,
       group_code, group_name,
       co_id, emp_name,
       fund_id,fund_name,period_mode,recovery_day,SUM(coll_amt)coll_amt,SUM(demand_amt)demand_after_collection,SUM(curr_outstanding)curr_outstanding
     FROM (
       SELECT 
         a.demand_date,a.branch_code, c.branch_name,
         a.group_code, d.group_name, d.co_id, e.emp_name,
         b.fund_id,f.fund_name,b.period_mode,
         CASE 
        WHEN b.period_mode = 'Monthly' THEN b.recovery_day
        WHEN b.period_mode = 'Weekly' THEN 
        CASE b.recovery_day
        WHEN 1 THEN 'Sunday'
        WHEN 2 THEN 'Monday'
        WHEN 3 THEN 'Tuesday'
        WHEN 4 THEN 'Wednesday'
        WHEN 5 THEN 'Thursday'
        WHEN 6 THEN 'Friday'
        WHEN 7 THEN 'Saturday'
        ELSE 'Unknown'
        END
        ELSE 'N/A'
        END AS recovery_day,SUM(a.dmd_amt) AS demand_amt,
         0 AS coll_amt, SUM(a.prn_amt + a.intt_amt) AS curr_outstanding
       FROM tt_loan_demand a
       LEFT JOIN td_loan b ON a.branch_code = b.branch_code AND a.loan_id = b.loan_id
       LEFT JOIN md_branch c ON a.branch_code = c.branch_code
       LEFT JOIN md_group d ON a.group_code = d.group_code
       LEFT JOIN md_employee e ON d.co_id = e.emp_id
       LEFT JOIN md_fund f ON b.fund_id = f.fund_id
       WHERE a.branch_code IN (${data.branch_code})
       AND b.fund_id IN (${data.fund_id})
       GROUP BY a.demand_date, a.branch_code, c.branch_name,
         a.group_code, d.group_name, d.co_id, e.emp_name,b.fund_id,f.fund_name,
         b.period_mode,b.recovery_day
         
       UNION
       
       SELECT 
         a.demand_date,a.branch_code, c.branch_name,
         a.group_code, d.group_name, d.co_id, e.emp_name,
         b.fund_id,f.fund_name,b.period_mode, 
         CASE 
        WHEN b.period_mode = 'Monthly' THEN b.recovery_day
        WHEN b.period_mode = 'Weekly' THEN 
        CASE b.recovery_day
        WHEN 1 THEN 'Sunday'
        WHEN 2 THEN 'Monday'
        WHEN 3 THEN 'Tuesday'
        WHEN 4 THEN 'Wednesday'
        WHEN 5 THEN 'Thursday'
        WHEN 6 THEN 'Friday'
        WHEN 7 THEN 'Saturday'
        ELSE 'Unknown'
        END
        ELSE 'N/A'
        END AS recovery_day,0 AS demand_amt,
         IFNULL(SUM(g.credit), 0) AS coll_amt, 0 AS curr_outstanding
       FROM tt_loan_demand a 
       LEFT JOIN td_loan b ON a.branch_code = b.branch_code 
       AND a.loan_id = b.loan_id 
       LEFT JOIN md_branch c ON a.branch_code = c.branch_code 
       LEFT JOIN md_group d ON a.group_code = d.group_code 
       LEFT JOIN md_employee e ON d.co_id = e.emp_id 
       LEFT JOIN md_fund f ON b.fund_id = f.fund_id
       LEFT JOIN td_loan_transactions g ON a.loan_id = g.loan_id
       WHERE a.branch_code IN (${data.branch_code})
       AND g.payment_date BETWEEN '${first_create_date}' AND '${create_date}'
       AND b.fund_id IN (${data.fund_id})
       GROUP BY a.demand_date, a.branch_code, c.branch_name,
         a.group_code, d.group_name, d.co_id, e.emp_name,
         b.fund_id,f.fund_name, b.period_mode,b.recovery_day
     ) a
      GROUP BY demand_date,branch_code,branch_name,group_code,group_name,co_id,emp_name,fund_id,fund_name,period_mode,recovery_day
      ORDER BY group_code
   `;
 
     var fund_demand_collec_data = await db_Select(select,null,null,null);
     res.send({
       fund_demand_collec_data,
       dateRange: `BETWEEN '${first_create_date}' AND '${create_date}'`
     });
   } catch (error) {
     console.error("Error fetching demand vs collection report fundwise:", error);
     res.send({ suc: 0, msg: "An error occurred" });
   }
 });

//CO NAME FETCH
 dmd_vs_collRouter.post("/fetch__co_name", async (req, res) => {
        var data = req.body;

        var select = "DISTINCT a.co_id,ifnull(b.emp_name,'NA')emp_name",
        table_name = "md_group a LEFT JOIN md_employee b ON a.co_id = b.emp_id",
        whr = `a.branch_code IN (${data.branch_code})`,
        order = null;
        var branch_co = await db_Select(select,table_name,whr,order);
    
        res.send(branch_co)
    });

//DEMAND VS COLLECTION REPORT COWISE
dmd_vs_collRouter.post("/dmd_vs_collec_report_cowise", async (req, res) => {
   try {
     var data = req.body;
 
     // Get last and first dates of the selected month
     var date_query = `LAST_DAY(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01')) AS month_last_date`;
     var first_date_query = `STR_TO_DATE(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01'), '%Y-%m-%d') AS first_day_of_month`;
 
     var dateResult = await db_Select(date_query);
     var first_dateResult = await db_Select(first_date_query);
 
     var create_date = dateFormat(dateResult.msg[0].month_last_date, 'yyyy-mm-dd');
     var first_create_date = dateFormat(first_dateResult.msg[0].first_day_of_month, 'yyyy-mm-dd');
     
     var select = ` 
       DATE_FORMAT(demand_date, '%M %Y') AS demand_date,CONCAT(STR_TO_DATE('${first_create_date}', '%Y-%m-%d'), ' to ', STR_TO_DATE('${create_date}', '%Y-%m-%d')) AS collec_upto,
       branch_code, branch_name,
       group_code, group_name,
       co_id, emp_name,
       period_mode,recovery_day,SUM(tot_emi) tot_emi,SUM(coll_amt)coll_amt,SUM(demand_amt)demand_after_collection,SUM(curr_outstanding)curr_outstanding
     FROM (
       SELECT 
         a.demand_date,a.branch_code, c.branch_name,
         a.group_code, d.group_name, d.co_id, e.emp_name,
         b.period_mode,
         CASE 
        WHEN b.period_mode = 'Monthly' THEN b.recovery_day
        WHEN b.period_mode = 'Weekly' THEN 
        CASE b.recovery_day
        WHEN 1 THEN 'Sunday'
        WHEN 2 THEN 'Monday'
        WHEN 3 THEN 'Tuesday'
        WHEN 4 THEN 'Wednesday'
        WHEN 5 THEN 'Thursday'
        WHEN 6 THEN 'Friday'
        WHEN 7 THEN 'Saturday'
        ELSE 'Unknown'
        END
        ELSE 'N/A'
        END AS recovery_day,SUM(b.tot_emi) tot_emi,SUM(a.dmd_amt) AS demand_amt,
         0 AS coll_amt, SUM(a.prn_amt + a.intt_amt) AS curr_outstanding
       FROM tt_loan_demand a
       LEFT JOIN td_loan b ON a.branch_code = b.branch_code AND a.loan_id = b.loan_id
       LEFT JOIN md_branch c ON a.branch_code = c.branch_code
       LEFT JOIN md_group d ON a.group_code = d.group_code
       LEFT JOIN md_employee e ON d.co_id = e.emp_id
       WHERE a.branch_code IN (${data.branch_code})
       AND d.co_id IN (${data.co_id})
       GROUP BY a.demand_date, a.branch_code, c.branch_name,
         a.group_code, d.group_name, d.co_id, e.emp_name,
         b.period_mode,b.recovery_day
         
       UNION
       
       SELECT 
         a.demand_date,a.branch_code, c.branch_name,
         a.group_code, d.group_name, d.co_id, e.emp_name,
         b.period_mode, 
         CASE 
        WHEN b.period_mode = 'Monthly' THEN b.recovery_day
        WHEN b.period_mode = 'Weekly' THEN 
        CASE b.recovery_day
        WHEN 1 THEN 'Sunday'
        WHEN 2 THEN 'Monday'
        WHEN 3 THEN 'Tuesday'
        WHEN 4 THEN 'Wednesday'
        WHEN 5 THEN 'Thursday'
        WHEN 6 THEN 'Friday'
        WHEN 7 THEN 'Saturday'
        ELSE 'Unknown'
        END
        ELSE 'N/A'
        END AS recovery_day,0 AS tot_emi, 0 AS demand_amt,
         IFNULL(SUM(f.credit), 0) AS coll_amt, 0 AS curr_outstanding
       FROM tt_loan_demand a 
       LEFT JOIN td_loan b ON a.branch_code = b.branch_code 
       AND a.loan_id = b.loan_id 
       LEFT JOIN md_branch c ON a.branch_code = c.branch_code 
       LEFT JOIN md_group d ON a.group_code = d.group_code 
       LEFT JOIN md_employee e ON d.co_id = e.emp_id
       LEFT JOIN td_loan_transactions f ON a.loan_id = f.loan_id
       WHERE a.branch_code IN (${data.branch_code})
       AND f.payment_date BETWEEN '${first_create_date}' AND '${create_date}'
      AND d.co_id IN (${data.co_id})
       GROUP BY a.demand_date, a.branch_code, c.branch_name,
         a.group_code, d.group_name, d.co_id, e.emp_name,
         b.period_mode,b.recovery_day
     ) a
      GROUP BY demand_date,branch_code,branch_name,group_code,group_name,co_id,emp_name,period_mode,recovery_day
      ORDER BY group_code
   `;
 
     var co_demand_collec_data = await db_Select(select,null,null,null);
     res.send({
       co_demand_collec_data,
       dateRange: `BETWEEN '${first_create_date}' AND '${create_date}'`
     });
   } catch (error) {
     console.error("Error fetching demand vs collection report cowise:", error);
     res.send({ suc: 0, msg: "An error occurred" });
   }
 });

// DEMAND VS COLLECTION REPORT MEMBERWISE
dmd_vs_collRouter.post("/dmd_vs_collec_report_memberwise", async (req, res) => {
   try {
     var data = req.body;
 
     // Get last and first dates of the selected month
     var date_query = `LAST_DAY(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01')) AS month_last_date`;
     var first_date_query = `STR_TO_DATE(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01'), '%Y-%m-%d') AS first_day_of_month`;
 
     var dateResult = await db_Select(date_query);
     var first_dateResult = await db_Select(first_date_query);
 
     var create_date = dateFormat(dateResult.msg[0].month_last_date, 'yyyy-mm-dd');
     var first_create_date = dateFormat(first_dateResult.msg[0].first_day_of_month, 'yyyy-mm-dd');
     
     var select = ` 
        DATE_FORMAT(demand_date, '%M %Y') AS demand_date,
  CONCAT(STR_TO_DATE('${first_create_date}', '%Y-%m-%d'), ' to ', STR_TO_DATE('${create_date}', '%Y-%m-%d')) AS "collec between",
  branch_code, branch_name,loan_id,member_code,client_name,
  group_code, group_name,
  co_id, emp_name,
  disb_dt,disb_amt, curr_roi, loan_period, period_mode,recovery_day,
  instl_start_dt, instl_end_dt,
  tot_emi,coll_amt,demand_amt AS demand_after_collection,curr_outstanding
FROM (
  SELECT 
    a.demand_date,a.branch_code,c.branch_name,
    a.loan_id,a.member_code,f.client_name,
    a.group_code, d.group_name, d.co_id, e.emp_name,
    b.disb_dt,b.prn_disb_amt AS disb_amt,
    b.curr_roi, b.period AS loan_period, b.period_mode,
     CASE 
        WHEN b.period_mode = 'Monthly' THEN b.recovery_day
        WHEN b.period_mode = 'Weekly' THEN 
        CASE b.recovery_day
        WHEN 1 THEN 'Sunday'
        WHEN 2 THEN 'Monday'
        WHEN 3 THEN 'Tuesday'
        WHEN 4 THEN 'Wednesday'
        WHEN 5 THEN 'Thursday'
        WHEN 6 THEN 'Friday'
        WHEN 7 THEN 'Saturday'
        ELSE 'Unknown'
        END
        ELSE 'N/A'
        END AS recovery_day,
    b.instl_start_dt,b.instl_end_dt,
    b.tot_emi AS tot_emi, a.dmd_amt AS demand_amt,
    0 AS coll_amt,(a.prn_amt + a.intt_amt) AS curr_outstanding
  FROM tt_loan_demand a 
  LEFT JOIN td_loan b ON a.branch_code = b.branch_code AND a.loan_id = b.loan_id 
  LEFT JOIN md_branch c ON a.branch_code = c.branch_code 
  LEFT JOIN md_group d ON a.group_code = d.group_code 
  LEFT JOIN md_employee e ON d.co_id = e.emp_id 
  LEFT JOIN md_member f ON a.member_code = f.member_code
  WHERE a.branch_code IN (${data.branch_code})
    
  UNION
  
  SELECT 
    a.demand_date,a.branch_code, c.branch_name,
    a.loan_id,a.member_code,f.client_name,
    a.group_code, d.group_name, d.co_id, e.emp_name,
    b.disb_dt, 0 AS disb_amt,
    b.curr_roi, b.period AS loan_period, b.period_mode,
     CASE 
        WHEN b.period_mode = 'Monthly' THEN b.recovery_day
        WHEN b.period_mode = 'Weekly' THEN 
        CASE b.recovery_day
        WHEN 1 THEN 'Sunday'
        WHEN 2 THEN 'Monday'
        WHEN 3 THEN 'Tuesday'
        WHEN 4 THEN 'Wednesday'
        WHEN 5 THEN 'Thursday'
        WHEN 6 THEN 'Friday'
        WHEN 7 THEN 'Saturday'
        ELSE 'Unknown'
        END
        ELSE 'N/A'
        END AS recovery_day,
    b.instl_start_dt,b.instl_end_dt,
    0 AS tot_emi, 0 AS demand_amt,
    IFNULL(SUM(g.credit), 0) AS coll_amt, 0 AS curr_outstanding
  FROM tt_loan_demand a 
  LEFT JOIN td_loan b ON a.branch_code = b.branch_code AND a.loan_id = b.loan_id 
  LEFT JOIN md_branch c ON a.branch_code = c.branch_code 
  LEFT JOIN md_group d ON a.group_code = d.group_code 
  LEFT JOIN md_employee e ON d.co_id = e.emp_id 
  LEFT JOIN md_member f ON a.member_code = f.member_code
  LEFT JOIN td_loan_transactions g ON a.loan_id = g.loan_id
  WHERE a.branch_code IN (${data.branch_code})
  AND g.payment_date BETWEEN '${first_create_date}' AND '${create_date}'
  GROUP BY a.demand_date, a.branch_code, c.branch_name,
           a.loan_id,a.member_code,f.client_name,
           a.group_code, d.group_name, d.co_id, e.emp_name,
           b.disb_dt,b.curr_roi, b.period, b.period_mode,b.recovery_day,
           b.instl_start_dt, b.instl_end_dt
) AS a
ORDER BY group_code;`
 
     var member_demand_collec_data = await db_Select(select,null,null,null);
     res.send({
       member_demand_collec_data,
       dateRange: `BETWEEN '${first_create_date}' AND '${create_date}'`
     });
   } catch (error) {
     console.error("Error fetching demand vs collection report memberwise:", error);
     res.send({ suc: 0, msg: "An error occurred" });
   }
 });

// DEMAND VS COLLECTION REPORT BRANCHWISE
dmd_vs_collRouter.post("/dmd_vs_collec_report_branchwise", async (req, res) => {
  try {
    var data = req.body;

    // Get last and first dates of the selected month
    var date_query = `LAST_DAY(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01')) AS month_last_date`;
    var first_date_query = `STR_TO_DATE(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01'), '%Y-%m-%d') AS first_day_of_month`;

    var dateResult = await db_Select(date_query);
    var first_dateResult = await db_Select(first_date_query);

    var create_date = dateFormat(dateResult.msg[0].month_last_date, 'yyyy-mm-dd');
    var first_create_date = dateFormat(first_dateResult.msg[0].first_day_of_month, 'yyyy-mm-dd');
    
    var select = ` 
      DATE_FORMAT(demand_date, '%M %Y') AS demand_date,CONCAT(STR_TO_DATE('${first_create_date}', '%Y-%m-%d'), ' to ', STR_TO_DATE('${create_date}', '%Y-%m-%d')) AS "collec between",
      branch_code, branch_name,
      SUM(tot_emi)tot_emi,SUM(coll_amt)coll_amt,SUM(demand_amt)demand_after_collection,SUM(curr_outstanding)curr_outstanding
    FROM (
      SELECT 
        a.demand_date,a.branch_code,c.branch_name,
        SUM(b.tot_emi) AS tot_emi, SUM(a.dmd_amt) AS demand_amt,
        0 AS coll_amt, SUM(a.prn_amt + a.intt_amt) AS curr_outstanding
        FROM tt_loan_demand a
        LEFT JOIN td_loan b ON a.branch_code = b.branch_code AND a.loan_id = b.loan_id
        LEFT JOIN md_branch c ON a.branch_code = c.branch_code
        WHERE a.branch_code IN (${data.branch_code})
        GROUP BY a.demand_date, a.branch_code, c.branch_name
        
      UNION
      
      SELECT 
        a.demand_date,a.branch_code,c.branch_name,
        0 AS tot_emi, 0 AS demand_amt,
        IFNULL(SUM(d.credit), 0) AS coll_amt, 0 AS curr_outstanding
        FROM tt_loan_demand a
        LEFT JOIN td_loan b ON a.branch_code = b.branch_code AND a.loan_id = b.loan_id
        LEFT JOIN md_branch c ON a.branch_code = c.branch_code
        LEFT JOIN td_loan_transactions d ON a.loan_id = d.loan_id
        WHERE a.branch_code IN (${data.branch_code})
        AND d.payment_date BETWEEN '${first_create_date}' AND '${create_date}'
        GROUP BY a.demand_date, a.branch_code, c.branch_name
    ) a
       GROUP BY demand_date,branch_code,branch_name
     ORDER BY branch_code
  `;

    var branch_demand_collec_data = await db_Select(select,null,null,null);
    res.send({
      branch_demand_collec_data,
      dateRange: `BETWEEN '${first_create_date}' AND '${create_date}'`
    });
  } catch (error) {
    console.error("Error fetching demand vs collection report branchwise:", error);
    res.send({ suc: 0, msg: "An error occurred" });
  }
});

//loan demand vs collection report groupwise via day 21.05.2025

dmd_vs_collRouter.post("/filter_dayawise_coll_report_groupwise", async (req, res) => {
    try {
    var data = req.body;

    // Get last and first dates of the selected month
    var date_query = `LAST_DAY(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01')) AS month_last_date`;
    var first_date_query = `STR_TO_DATE(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01'), '%Y-%m-%d') AS first_day_of_month`;

    var dateResult = await db_Select(date_query);
    var first_dateResult = await db_Select(first_date_query);

    var create_date = dateFormat(dateResult.msg[0].month_last_date, 'yyyy-mm-dd');
    var first_create_date = dateFormat(first_dateResult.msg[0].first_day_of_month, 'yyyy-mm-dd');
    
    var select = ` 
      DATE_FORMAT(demand_date, '%M %Y') AS demand_date,CONCAT(STR_TO_DATE('${first_create_date}', '%Y-%m-%d'), ' to ', STR_TO_DATE('${create_date}', '%Y-%m-%d')) AS "collec between",
      branch_code, branch_name,
      group_code, group_name,
      co_id, emp_name,
      disb_dt, SUM(disb_amt)disb_amt, curr_roi, loan_period, period_mode,
      recovery_day,instl_start_dt, instl_end_dt,
      SUM(tot_emi)tot_emi,SUM(coll_amt)coll_amt,SUM(demand_amt)demand_after_collection,SUM(curr_outstanding)curr_outstanding
    FROM (
      SELECT 
        a.demand_date,a.branch_code,c.branch_name,
        a.group_code, d.group_name, d.co_id, e.emp_name,
        b.disb_dt, SUM(b.prn_disb_amt) AS disb_amt,
        b.curr_roi, b.period AS loan_period, b.period_mode,
        CASE 
        WHEN b.period_mode = 'Monthly' THEN b.recovery_day
        WHEN b.period_mode = 'Weekly' THEN 
        CASE b.recovery_day
        WHEN 1 THEN 'Sunday'
        WHEN 2 THEN 'Monday'
        WHEN 3 THEN 'Tuesday'
        WHEN 4 THEN 'Wednesday'
        WHEN 5 THEN 'Thursday'
        WHEN 6 THEN 'Friday'
        WHEN 7 THEN 'Saturday'
        ELSE 'Unknown'
        END
        ELSE 'N/A'
        END AS recovery_day,
        b.instl_start_dt,b.instl_end_dt,
        SUM(b.tot_emi) AS tot_emi, SUM(a.dmd_amt) AS demand_amt,
        0 AS coll_amt, SUM(a.prn_amt + a.intt_amt) AS curr_outstanding
      FROM tt_loan_demand a
      LEFT JOIN td_loan b ON a.branch_code = b.branch_code AND a.loan_id = b.loan_id
      LEFT JOIN md_branch c ON a.branch_code = c.branch_code
      LEFT JOIN md_group d ON a.group_code = d.group_code
      LEFT JOIN md_employee e ON d.co_id = e.emp_id
      WHERE b.period_mode = '${data.period_mode}' AND b.recovery_day BETWEEN '${data.from_day}' AND '${data.to_day}'
      GROUP BY a.demand_date, a.branch_code, c.branch_name,
        a.group_code, d.group_name, d.co_id, e.emp_name,b.disb_dt,
        b.curr_roi, b.period, b.period_mode,b.recovery_day, b.instl_start_dt,b.instl_end_dt
        
      UNION
      
      SELECT 
        a.demand_date,a.branch_code, c.branch_name,
        a.group_code, d.group_name, d.co_id, e.emp_name,
        b.disb_dt, 0 AS disb_amt,
        b.curr_roi, b.period AS loan_period, b.period_mode,
        CASE 
        WHEN b.period_mode = 'Monthly' THEN b.recovery_day
        WHEN b.period_mode = 'Weekly' THEN 
        CASE b.recovery_day
        WHEN 1 THEN 'Sunday'
        WHEN 2 THEN 'Monday'
        WHEN 3 THEN 'Tuesday'
        WHEN 4 THEN 'Wednesday'
        WHEN 5 THEN 'Thursday'
        WHEN 6 THEN 'Friday'
        WHEN 7 THEN 'Saturday'
        ELSE 'Unknown'
        END
        ELSE 'N/A'
        END AS recovery_day,
        b.instl_start_dt,b.instl_end_dt,
        0 AS tot_emi, 0 AS demand_amt,
        IFNULL(SUM(f.credit), 0) AS coll_amt, 0 AS curr_outstanding
      FROM tt_loan_demand a
      LEFT JOIN td_loan b ON a.branch_code = b.branch_code AND a.loan_id = b.loan_id
      LEFT JOIN md_branch c ON a.branch_code = c.branch_code
      LEFT JOIN md_group d ON a.group_code = d.group_code
      LEFT JOIN md_employee e ON d.co_id = e.emp_id
      LEFT JOIN td_loan_transactions f ON a.loan_id = f.loan_id
      WHERE b.period_mode = '${data.period_mode}' AND b.recovery_day BETWEEN '${data.from_day}' AND '${data.to_day}'
      GROUP BY a.demand_date, a.branch_code, c.branch_name,
        a.group_code, d.group_name, d.co_id, e.emp_name,b.disb_dt,
        b.curr_roi, b.period, b.period_mode,b.recovery_day,b.instl_start_dt,b.instl_end_dt
    ) a
       GROUP BY demand_date,branch_code,branch_name,group_code,group_name,co_id,emp_name,disb_dt,curr_roi,loan_period,period_mode,recovery_day,instl_start_dt,instl_end_dt
     ORDER BY group_code
  `;
    var groupwise_demand_collec_data_day = await db_Select(select,null,null,null);
    res.send({
      groupwise_demand_collec_data_day,
      dateRange: `BETWEEN '${first_create_date}' AND '${create_date}'`
    });
  } catch (error) {
    console.error("Error fetching demand vs collection report groupwise:", error);
    res.send({ suc: 0, msg: "An error occurred" });
  }
});


//loan demand vs collection report fundwise via day 21.05.2025

dmd_vs_collRouter.post("/filter_dayawise_coll_report_fundwise", async (req, res) => {
    try {
     var data = req.body;
 
     // Get last and first dates of the selected month
     var date_query = `LAST_DAY(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01')) AS month_last_date`;
     var first_date_query = `STR_TO_DATE(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01'), '%Y-%m-%d') AS first_day_of_month`;
 
     var dateResult = await db_Select(date_query);
     var first_dateResult = await db_Select(first_date_query);
 
     var create_date = dateFormat(dateResult.msg[0].month_last_date, 'yyyy-mm-dd');
     var first_create_date = dateFormat(first_dateResult.msg[0].first_day_of_month, 'yyyy-mm-dd');
     
     var select = ` 
       DATE_FORMAT(demand_date, '%M %Y') AS demand_date,CONCAT(STR_TO_DATE('${first_create_date}', '%Y-%m-%d'), ' to ', STR_TO_DATE('${create_date}', '%Y-%m-%d')) AS collec_upto,
       branch_code, branch_name,
       group_code, group_name,
       co_id, emp_name,
       fund_id,fund_name,period_mode,recovery_day,SUM(coll_amt)coll_amt,SUM(demand_amt)demand_after_collection,SUM(curr_outstanding)curr_outstanding
     FROM (
       SELECT 
         a.demand_date,a.branch_code, c.branch_name,
         a.group_code, d.group_name, d.co_id, e.emp_name,
         b.fund_id,f.fund_name,b.period_mode,
         CASE 
        WHEN b.period_mode = 'Monthly' THEN b.recovery_day
        WHEN b.period_mode = 'Weekly' THEN 
        CASE b.recovery_day
        WHEN 1 THEN 'Sunday'
        WHEN 2 THEN 'Monday'
        WHEN 3 THEN 'Tuesday'
        WHEN 4 THEN 'Wednesday'
        WHEN 5 THEN 'Thursday'
        WHEN 6 THEN 'Friday'
        WHEN 7 THEN 'Saturday'
        ELSE 'Unknown'
        END
        ELSE 'N/A'
        END AS recovery_day,SUM(a.dmd_amt) AS demand_amt,
         0 AS coll_amt, SUM(a.prn_amt + a.intt_amt) AS curr_outstanding
       FROM tt_loan_demand a
       LEFT JOIN td_loan b ON a.branch_code = b.branch_code AND a.loan_id = b.loan_id
       LEFT JOIN md_branch c ON a.branch_code = c.branch_code
       LEFT JOIN md_group d ON a.group_code = d.group_code
       LEFT JOIN md_employee e ON d.co_id = e.emp_id
       LEFT JOIN md_fund f ON b.fund_id = f.fund_id
       WHERE b.period_mode = '${data.period_mode}' AND b.recovery_day BETWEEN '${data.from_day}' AND '${data.to_day}'
       GROUP BY a.demand_date, a.branch_code, c.branch_name,
         a.group_code, d.group_name, d.co_id, e.emp_name,b.fund_id,f.fund_name,
         b.period_mode,b.recovery_day
         
       UNION
       
       SELECT 
         a.demand_date,a.branch_code, c.branch_name,
         a.group_code, d.group_name, d.co_id, e.emp_name,
         b.fund_id,f.fund_name,b.period_mode, 
         CASE 
        WHEN b.period_mode = 'Monthly' THEN b.recovery_day
        WHEN b.period_mode = 'Weekly' THEN 
        CASE b.recovery_day
        WHEN 1 THEN 'Sunday'
        WHEN 2 THEN 'Monday'
        WHEN 3 THEN 'Tuesday'
        WHEN 4 THEN 'Wednesday'
        WHEN 5 THEN 'Thursday'
        WHEN 6 THEN 'Friday'
        WHEN 7 THEN 'Saturday'
        ELSE 'Unknown'
        END
        ELSE 'N/A'
        END AS recovery_day,0 AS demand_amt,
         IFNULL(SUM(g.credit), 0) AS coll_amt, 0 AS curr_outstanding
       FROM tt_loan_demand a 
       LEFT JOIN td_loan b ON a.branch_code = b.branch_code 
       AND a.loan_id = b.loan_id 
       LEFT JOIN md_branch c ON a.branch_code = c.branch_code 
       LEFT JOIN md_group d ON a.group_code = d.group_code 
       LEFT JOIN md_employee e ON d.co_id = e.emp_id 
       LEFT JOIN md_fund f ON b.fund_id = f.fund_id
       LEFT JOIN td_loan_transactions g ON a.loan_id = g.loan_id
       WHERE b.period_mode = '${data.period_mode}' AND b.recovery_day BETWEEN '${data.from_day}' AND '${data.to_day}'
       GROUP BY a.demand_date, a.branch_code, c.branch_name,
         a.group_code, d.group_name, d.co_id, e.emp_name,
         b.fund_id,f.fund_name, b.period_mode,b.recovery_day
     ) a
      GROUP BY demand_date,branch_code,branch_name,group_code,group_name,co_id,emp_name,fund_id,fund_name,period_mode,recovery_day
      ORDER BY group_code
   `;
 
     var fund_demand_collec_data_day = await db_Select(select,null,null,null);
     res.send({
       fund_demand_collec_data_day,
       dateRange: `BETWEEN '${first_create_date}' AND '${create_date}'`
     });
   } catch (error) {
     console.error("Error fetching demand vs collection report fundwise:", error);
     res.send({ suc: 0, msg: "An error occurred" });
   }
});


//loan demand vs collection report cowise via day 21.05.2025

dmd_vs_collRouter.post("/filter_dayawise_coll_report_cowise", async (req, res) => {
    try {
     var data = req.body;
 
     // Get last and first dates of the selected month
     var date_query = `LAST_DAY(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01')) AS month_last_date`;
     var first_date_query = `STR_TO_DATE(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01'), '%Y-%m-%d') AS first_day_of_month`;
 
     var dateResult = await db_Select(date_query);
     var first_dateResult = await db_Select(first_date_query);
 
     var create_date = dateFormat(dateResult.msg[0].month_last_date, 'yyyy-mm-dd');
     var first_create_date = dateFormat(first_dateResult.msg[0].first_day_of_month, 'yyyy-mm-dd');
     
     var select = ` 
       DATE_FORMAT(demand_date, '%M %Y') AS demand_date,CONCAT(STR_TO_DATE('${first_create_date}', '%Y-%m-%d'), ' to ', STR_TO_DATE('${create_date}', '%Y-%m-%d')) AS collec_upto,
       branch_code, branch_name,
       group_code, group_name,
       co_id, emp_name,
       period_mode,recovery_day,SUM(tot_emi) tot_emi,SUM(coll_amt)coll_amt,SUM(demand_amt)demand_after_collection,SUM(curr_outstanding)curr_outstanding
     FROM (
       SELECT 
         a.demand_date,a.branch_code, c.branch_name,
         a.group_code, d.group_name, d.co_id, e.emp_name,
         b.period_mode,
         CASE 
        WHEN b.period_mode = 'Monthly' THEN b.recovery_day
        WHEN b.period_mode = 'Weekly' THEN 
        CASE b.recovery_day
        WHEN 1 THEN 'Sunday'
        WHEN 2 THEN 'Monday'
        WHEN 3 THEN 'Tuesday'
        WHEN 4 THEN 'Wednesday'
        WHEN 5 THEN 'Thursday'
        WHEN 6 THEN 'Friday'
        WHEN 7 THEN 'Saturday'
        ELSE 'Unknown'
        END
        ELSE 'N/A'
        END AS recovery_day,SUM(b.tot_emi) tot_emi,SUM(a.dmd_amt) AS demand_amt,
         0 AS coll_amt, SUM(a.prn_amt + a.intt_amt) AS curr_outstanding
       FROM tt_loan_demand a
       LEFT JOIN td_loan b ON a.branch_code = b.branch_code AND a.loan_id = b.loan_id
       LEFT JOIN md_branch c ON a.branch_code = c.branch_code
       LEFT JOIN md_group d ON a.group_code = d.group_code
       LEFT JOIN md_employee e ON d.co_id = e.emp_id
       WHERE b.period_mode = '${data.period_mode}' AND b.recovery_day BETWEEN '${data.from_day}' AND '${data.to_day}'
       GROUP BY a.demand_date, a.branch_code, c.branch_name,
         a.group_code, d.group_name, d.co_id, e.emp_name,
         b.period_mode,b.recovery_day
         
       UNION
       
       SELECT 
         a.demand_date,a.branch_code, c.branch_name,
         a.group_code, d.group_name, d.co_id, e.emp_name,
         b.period_mode, 
         CASE 
        WHEN b.period_mode = 'Monthly' THEN b.recovery_day
        WHEN b.period_mode = 'Weekly' THEN 
        CASE b.recovery_day
        WHEN 1 THEN 'Sunday'
        WHEN 2 THEN 'Monday'
        WHEN 3 THEN 'Tuesday'
        WHEN 4 THEN 'Wednesday'
        WHEN 5 THEN 'Thursday'
        WHEN 6 THEN 'Friday'
        WHEN 7 THEN 'Saturday'
        ELSE 'Unknown'
        END
        ELSE 'N/A'
        END AS recovery_day,0 AS tot_emi, 0 AS demand_amt,
         IFNULL(SUM(f.credit), 0) AS coll_amt, 0 AS curr_outstanding
       FROM tt_loan_demand a 
       LEFT JOIN td_loan b ON a.branch_code = b.branch_code 
       AND a.loan_id = b.loan_id 
       LEFT JOIN md_branch c ON a.branch_code = c.branch_code 
       LEFT JOIN md_group d ON a.group_code = d.group_code 
       LEFT JOIN md_employee e ON d.co_id = e.emp_id
       LEFT JOIN td_loan_transactions f ON a.loan_id = f.loan_id
       WHERE b.period_mode = '${data.period_mode}' AND b.recovery_day BETWEEN '${data.from_day}' AND '${data.to_day}'
       GROUP BY a.demand_date, a.branch_code, c.branch_name,
         a.group_code, d.group_name, d.co_id, e.emp_name,
         b.period_mode,b.recovery_day
     ) a
      GROUP BY demand_date,branch_code,branch_name,group_code,group_name,co_id,emp_name,period_mode,recovery_day
      ORDER BY group_code
   `;
 
     var co_demand_collec_data_day = await db_Select(select,null,null,null);
     res.send({
       co_demand_collec_data_day,
       dateRange: `BETWEEN '${first_create_date}' AND '${create_date}'`
     });
   } catch (error) {
     console.error("Error fetching demand vs collection report cowise:", error);
     res.send({ suc: 0, msg: "An error occurred" });
   }
});


//loan demand vs collection report memberwise via day 21.05.2025

dmd_vs_collRouter.post("/filter_dayawise_coll_report_membwise", async (req, res) => {
    try {
     var data = req.body;
 
     // Get last and first dates of the selected month
     var date_query = `LAST_DAY(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01')) AS month_last_date`;
     var first_date_query = `STR_TO_DATE(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01'), '%Y-%m-%d') AS first_day_of_month`;
 
     var dateResult = await db_Select(date_query);
     var first_dateResult = await db_Select(first_date_query);
 
     var create_date = dateFormat(dateResult.msg[0].month_last_date, 'yyyy-mm-dd');
     var first_create_date = dateFormat(first_dateResult.msg[0].first_day_of_month, 'yyyy-mm-dd');
     
     var select = ` 
        DATE_FORMAT(demand_date, '%M %Y') AS demand_date,
  CONCAT(STR_TO_DATE('${first_create_date}', '%Y-%m-%d'), ' to ', STR_TO_DATE('${create_date}', '%Y-%m-%d')) AS "collec between",
  branch_code, branch_name,loan_id,member_code,client_name,
  group_code, group_name,
  co_id, emp_name,
  disb_dt,disb_amt, curr_roi, loan_period, period_mode,recovery_day,
  instl_start_dt, instl_end_dt,
  tot_emi,coll_amt,demand_amt AS demand_after_collection,curr_outstanding
FROM (
  SELECT 
    a.demand_date,a.branch_code,c.branch_name,
    a.loan_id,a.member_code,f.client_name,
    a.group_code, d.group_name, d.co_id, e.emp_name,
    b.disb_dt,b.prn_disb_amt AS disb_amt,
    b.curr_roi, b.period AS loan_period, b.period_mode,
     CASE 
        WHEN b.period_mode = 'Monthly' THEN b.recovery_day
        WHEN b.period_mode = 'Weekly' THEN 
        CASE b.recovery_day
        WHEN 1 THEN 'Sunday'
        WHEN 2 THEN 'Monday'
        WHEN 3 THEN 'Tuesday'
        WHEN 4 THEN 'Wednesday'
        WHEN 5 THEN 'Thursday'
        WHEN 6 THEN 'Friday'
        WHEN 7 THEN 'Saturday'
        ELSE 'Unknown'
        END
        ELSE 'N/A'
        END AS recovery_day,
    b.instl_start_dt,b.instl_end_dt,
    b.tot_emi AS tot_emi, a.dmd_amt AS demand_amt,
    0 AS coll_amt,(a.prn_amt + a.intt_amt) AS curr_outstanding
  FROM tt_loan_demand a 
  LEFT JOIN td_loan b ON a.branch_code = b.branch_code AND a.loan_id = b.loan_id 
  LEFT JOIN md_branch c ON a.branch_code = c.branch_code 
  LEFT JOIN md_group d ON a.group_code = d.group_code 
  LEFT JOIN md_employee e ON d.co_id = e.emp_id 
  LEFT JOIN md_member f ON a.member_code = f.member_code
  WHERE b.period_mode = '${data.period_mode}' AND b.recovery_day BETWEEN '${data.from_day}' AND '${data.to_day}'
    
  UNION
  
  SELECT 
    a.demand_date,a.branch_code, c.branch_name,
    a.loan_id,a.member_code,f.client_name,
    a.group_code, d.group_name, d.co_id, e.emp_name,
    b.disb_dt, 0 AS disb_amt,
    b.curr_roi, b.period AS loan_period, b.period_mode,
     CASE 
        WHEN b.period_mode = 'Monthly' THEN b.recovery_day
        WHEN b.period_mode = 'Weekly' THEN 
        CASE b.recovery_day
        WHEN 1 THEN 'Sunday'
        WHEN 2 THEN 'Monday'
        WHEN 3 THEN 'Tuesday'
        WHEN 4 THEN 'Wednesday'
        WHEN 5 THEN 'Thursday'
        WHEN 6 THEN 'Friday'
        WHEN 7 THEN 'Saturday'
        ELSE 'Unknown'
        END
        ELSE 'N/A'
        END AS recovery_day,
    b.instl_start_dt,b.instl_end_dt,
    0 AS tot_emi, 0 AS demand_amt,
    IFNULL(SUM(g.credit), 0) AS coll_amt, 0 AS curr_outstanding
  FROM tt_loan_demand a 
  LEFT JOIN td_loan b ON a.branch_code = b.branch_code AND a.loan_id = b.loan_id 
  LEFT JOIN md_branch c ON a.branch_code = c.branch_code 
  LEFT JOIN md_group d ON a.group_code = d.group_code 
  LEFT JOIN md_employee e ON d.co_id = e.emp_id 
  LEFT JOIN md_member f ON a.member_code = f.member_code
  LEFT JOIN td_loan_transactions g ON a.loan_id = g.loan_id
  WHERE b.period_mode = '${data.period_mode}' AND b.recovery_day BETWEEN '${data.from_day}' AND '${data.to_day}'
  GROUP BY a.demand_date, a.branch_code, c.branch_name,
           a.loan_id,a.member_code,f.client_name,
           a.group_code, d.group_name, d.co_id, e.emp_name,
           b.disb_dt,b.curr_roi, b.period, b.period_mode,b.recovery_day,
           b.instl_start_dt, b.instl_end_dt
) AS a
ORDER BY group_code;`
 
     var member_demand_collec_data_day = await db_Select(select,null,null,null);
     res.send({
       member_demand_collec_data_day,
       dateRange: `BETWEEN '${first_create_date}' AND '${create_date}'`
     });
   } catch (error) {
     console.error("Error fetching demand vs collection report memberwise:", error);
     res.send({ suc: 0, msg: "An error occurred" });
   }
});

module.exports = {dmd_vs_collRouter}