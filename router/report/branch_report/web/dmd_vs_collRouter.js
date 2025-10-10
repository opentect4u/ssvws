const { db_Select, db_RunProcedureAndFetchData } = require('../../../../model/mysqlModel');

const express = require('express'),
dmd_vs_collRouter = express.Router(),
dateFormat = require('dateformat');
 
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
    
    // var select = "DATE_FORMAT(a.demand_date, '%M %Y') AS demand_date,a.branch_code,c.branch_name,a.group_code, d.group_name,d.co_id, e.emp_name,b.disb_dt, SUM(b.prn_disb_amt) AS disb_amt,b.curr_roi, b.period AS loan_period,b.period_mode,b.recovery_day  AS recovery_day,b.instl_start_dt,b.instl_end_dt,SUM(b.tot_emi) AS tot_emi, SUM(a.dmd_amt) AS demand_amt,SUM(coll_amt) AS coll_amt, SUM(a.prn_amt + a.intt_amt) AS curr_outstanding",
    // table_name = "tt_loan_demand a, td_loan b, md_branch c, md_group d, md_employee e",
    // whr = `a.loan_id = b.loan_id
    //        AND a.branch_code = c.branch_code
    //        AND a.group_code = d.group_code
    //        AND d.co_id = e.emp_id
    //        AND a.branch_code IN (${data.branch_code})`,
    // order = `GROUP BY a.demand_date, a.branch_code, c.branch_name,a.group_code, d.group_name, d.co_id, e.emp_name,b.disb_dt,b.curr_roi, b.period, b.period_mode,b.recovery_day,b.instl_start_dt,b.instl_end_dt
    // ORDER BY d.group_code`;
    var select = `demand_date,branch_code,branch_name,
                  group_cd, group_name,co_id, emp_name,
                  disb_dt, SUM(disb_amt)AS disb_amt,curr_roi, loan_period,period_mode,
                  recovery_day  AS recovery_day,instl_start_dt,instl_end_dt,
                  SUM(tot_emi) AS tot_emi, SUM(demand_amt) AS demand_amt,
                  SUM(coll_amt) AS coll_amt, SUM(curr_outstanding) AS curr_outstanding 
                  FROM(
		                  SELECT DATE_FORMAT(a.demand_date, '%M %Y') AS demand_date,a.branch_code,c.branch_name,
		                  a.group_cd, d.group_name,d.co_id, e.emp_name,
		                  b.disb_dt, SUM(b.prn_disb_amt) AS disb_amt,b.curr_roi, b.period AS loan_period,b.period_mode,
		                  b.recovery_day  AS recovery_day,b.instl_start_dt,b.instl_end_dt,
		                  SUM(b.tot_emi) AS tot_emi, SUM(a.dmd_amt) AS demand_amt,
		                  0 AS coll_amt, SUM(b.prn_amt + b.intt_amt) AS curr_outstanding
		                  FROM td_loan_month_demand a, td_loan b, md_branch c, md_group d, md_employee e
		                  WHERE a.loan_id = b.loan_id
		                        AND a.branch_code = c.branch_code
		                        AND a.group_cd = d.group_code
		                        AND d.co_id = e.emp_id
		                        AND a.branch_code IN (${data.branch_code})  
		                        AND a.demand_date = '${create_date}'
		                  GROUP BY a.demand_date, a.branch_code, c.branch_name,a.group_cd, d.group_name, d.co_id, 
		                  	 e.emp_name,b.disb_dt,b.curr_roi, b.period, b.period_mode,b.recovery_day,
		                  	 b.instl_start_dt,b.instl_end_dt
		              UNION
		                  SELECT DATE_FORMAT(a.demand_date, '%M %Y') AS demand_date,a.branch_code,c.branch_name,
		                  a.group_cd, d.group_name,d.co_id, e.emp_name,
		                  b.disb_dt, 0 AS disb_amt,b.curr_roi, b.period AS loan_period,b.period_mode,
		                  b.recovery_day  AS recovery_day,b.instl_start_dt,b.instl_end_dt,
		                  0 AS tot_emi, 0 AS demand_amt,
		                  SUM(f.credit) AS coll_amt, 0 AS curr_outstanding
		                  FROM td_loan_month_demand a, td_loan b, md_branch c, md_group d, md_employee e, td_loan_transactions f
		                  WHERE a.loan_id = b.loan_id
		                  AND a.loan_id = f.loan_id
		                      AND a.branch_code = c.branch_code
		                      AND a.group_cd = d.group_code
		                      AND d.co_id = e.emp_id
		                      AND a.branch_code IN (${data.branch_code})  
		                      AND a.demand_date = '${create_date}'
		                      AND f.payment_date BETWEEN '${first_create_date}' AND '${create_date}'
		                  GROUP BY a.demand_date, a.branch_code, c.branch_name,a.group_cd, d.group_name, d.co_id, 
			                e.emp_name,b.disb_dt,b.curr_roi, b.period, b.period_mode,b.recovery_day,
			                b.instl_start_dt,b.instl_end_dt
		                  )a	
	          GROUP BY demand_date,branch_code,branch_name,group_cd, group_name,co_id, emp_name,
                     disb_dt, curr_roi,loan_period,period_mode,recovery_day ,instl_start_dt,instl_end_dt
            ORDER BY group_cd`,
    table_name = null,
    whr = null,
    order = null;
    var groupwise_demand_collec_data = await db_Select(select,table_name,whr,order);
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
     
    //  var select = `a.demand_date,a.branch_code, c.branch_name,a.group_code, d.group_name, d.co_id, e.emp_name,b.fund_id,f.fund_name,b.period_mode,b.recovery_day AS recovery_day,SUM(a.dmd_amt) AS demand_amt,SUM(a.coll_amt) AS coll_amt, SUM(a.prn_amt + a.intt_amt) AS curr_outstanding`,
    //  table_name = "tt_loan_demand a LEFT JOIN td_loan b ON a.branch_code = b.branch_code AND a.loan_id = b.loan_id LEFT JOIN md_branch c ON a.branch_code = c.branch_code LEFT JOIN md_group d ON a.group_code = d.group_code LEFT JOIN md_employee e ON d.co_id = e.emp_id LEFT JOIN md_fund f ON b.fund_id = f.fund_id",
    //  whr = `a.branch_code IN (${data.branch_code})
    //    AND b.fund_id IN (${data.fund_id})`,
    //  order = `GROUP BY a.demand_date, a.branch_code, c.branch_name,a.group_code, d.group_name, d.co_id, e.emp_name,b.fund_id,f.fund_name,b.period_mode,b.recovery_day`;
    var select = `demand_date,branch_code,branch_name,
                  group_cd, group_name,co_id, emp_name,
                  fund_id, fund_name,period_mode,
                  recovery_day  AS recovery_day,
                  SUM(demand_amt) AS demand_amt,
                  SUM(coll_amt) AS coll_amt, SUM(curr_outstanding) AS curr_outstanding 
                  FROM(
		       SELECT DATE_FORMAT(a.demand_date, '%M %Y') AS demand_date,a.branch_code, c.branch_name,a.group_cd, d.group_name,d.co_id, e.emp_name,b.fund_id,f.fund_name,b.period_mode,b.recovery_day AS recovery_day,
		       SUM(a.dmd_amt) AS demand_amt,0 AS coll_amt, SUM(b.prn_amt + b.intt_amt) AS curr_outstanding
		       FROM td_loan_month_demand a, td_loan b, md_branch c, md_group d, md_employee e, md_fund f
		       WHERE a.branch_code = b.branch_code
		       AND a.loan_id = b.loan_id
		       AND a.branch_code = c.branch_code
		       AND a.group_cd = d.group_code
		       AND d.co_id = e.emp_id
		       AND b.fund_id = f.fund_id
		       AND a.branch_code IN (${data.branch_code})  
		       AND a.demand_date = '${create_date}'
		       AND b.fund_id IN (${data.fund_id})
		       GROUP BY a.demand_date, a.branch_code, c.branch_name,a.group_cd, d.group_name, d.co_id, e.emp_name,b.fund_id,
		       f.fund_name,b.period_mode,b.recovery_day
		 UNION
		       SELECT DATE_FORMAT(a.demand_date, '%M %Y') AS demand_date,a.branch_code,c.branch_name,a.group_cd, d.group_name,
		       d.co_id, e.emp_name,b.fund_id,f.fund_name,b.period_mode,b.recovery_day AS recovery_day,
		       0 AS demand_amt,SUM(g.credit) AS coll_amt, 0 AS curr_outstanding
		       FROM td_loan_month_demand a, td_loan b, md_branch c, md_group d, md_employee e, md_fund f, td_loan_transactions g
		       WHERE a.branch_code = b.branch_code
		       AND a.loan_id = b.loan_id
		       AND a.branch_code = c.branch_code
		       AND a.loan_id = g.loan_id
		       AND a.group_cd = d.group_code
		       AND d.co_id = e.emp_id
		       AND a.branch_code IN (${data.branch_code})  
		       AND a.demand_date = '${create_date}'
		       AND b.fund_id IN (${data.fund_id})
		       AND g.payment_date BETWEEN '${first_create_date}' AND '${create_date}'
		       GROUP BY a.demand_date, a.branch_code, c.branch_name,a.group_cd, d.group_name, d.co_id, e.emp_name,b.fund_id,
		       f.fund_name,b.period_mode,b.recovery_day
		       )a	
	          GROUP BY demand_date,branch_code,branch_name,group_cd, group_name,co_id, emp_name,fund_id, fund_name,period_mode,
                  recovery_day
            ORDER BY group_cd`,
     table_name = null,
     whr = null,
     order = null;
     var fund_demand_collec_data = await db_Select(select,table_name,whr,order);
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
     
     var select = `a.demand_date,a.branch_code, c.branch_name,a.group_code, d.group_name, d.co_id, e.emp_name,
         b.period_mode,b.recovery_day AS recovery_day,SUM(b.tot_emi) tot_emi,SUM(a.dmd_amt) AS demand_amt,
         SUM(a.coll_amt) AS coll_amt, SUM(a.prn_amt + a.intt_amt) AS curr_outstanding`,
     table_name = "tt_loan_demand a LEFT JOIN td_loan b ON a.branch_code = b.branch_code AND a.loan_id = b.loan_id LEFT JOIN md_branch c ON a.branch_code = c.branch_code LEFT JOIN md_group d ON a.group_code = d.group_code LEFT JOIN md_employee e ON d.co_id = e.emp_id",
     whr = `a.branch_code IN (${data.branch_code})
       AND d.co_id IN (${data.co_id})`,
     order = `GROUP BY a.demand_date, a.branch_code, c.branch_name,a.group_code, d.group_name, d.co_id, e.emp_name,
         b.period_mode,b.recovery_day`;
     var co_demand_collec_data = await db_Select(select,table_name,whr,order);
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
     
     var select = "DATE_FORMAT(a.demand_date, '%M %Y') AS demand_date,a.branch_code,c.branch_name,a.loan_id,a.member_code,f.client_name,f.client_mobile,a.group_code, d.group_name, d.co_id, e.emp_name,b.disb_dt,b.prn_disb_amt AS disb_amt,b.curr_roi, b.period AS loan_period, b.period_mode,b.recovery_day AS recovery_day,b.instl_start_dt,b.instl_end_dt,b.tot_emi AS tot_emi, a.dmd_amt AS demand_amt,a.coll_amt AS coll_amt,(a.prn_amt + a.intt_amt) AS curr_outstanding",
     table_name = "tt_loan_demand a,td_loan b,md_branch c,md_group d,md_employee e,md_member f",
     whr = `a.loan_id = b.loan_id
            AND a.branch_code = c.branch_code
            AND a.group_code = d.group_code
            AND d.co_id = e.emp_id
            AND a.member_code = f.member_code
            AND a.branch_code IN (${data.branch_code})`,
     order = `ORDER BY a.loan_id`;
     var member_demand_collec_data = await db_Select(select,table_name,whr,order);
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
    
    var select = `  a.demand_date,a.branch_code,c.branch_name,
        SUM(b.tot_emi) AS tot_emi, SUM(a.dmd_amt) AS demand_amt,
        SUM(a.coll_amt) AS coll_amt, SUM(a.prn_amt + a.intt_amt) AS curr_outstanding`,
    table_name = "tt_loan_demand a, td_loan b,md_branch c",
    whr = `a.loan_id = b.loan_id 
           AND a.branch_code = c.branch_code
           AND a.branch_code IN (${data.branch_code})`,
    order = `GROUP BY a.demand_date, a.branch_code, c.branch_name`
    var branch_demand_collec_data = await db_Select(select,table_name,whr,order);
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
    
    // var select = `DATE_FORMAT(a.demand_date, '%M %Y') AS demand_date,a.branch_code,c.branch_name,a.group_code, d.group_name,d.co_id, e.emp_name,b.disb_dt, SUM(b.prn_disb_amt) AS disb_amt,b.curr_roi, b.period AS loan_period,b.period_mode,b.recovery_day  AS recovery_day,b.instl_start_dt,b.instl_end_dt,SUM(b.tot_emi) AS tot_emi, SUM(a.dmd_amt) AS demand_amt,SUM(coll_amt) AS coll_amt, SUM(a.prn_amt + a.intt_amt) AS curr_outstanding`,
    // table_name = "tt_loan_demand a, td_loan b, md_branch c, md_group d, md_employee e",
    // whr = `a.loan_id = b.loan_id
    //   AND a.branch_code = c.branch_code
    //   AND a.group_code = d.group_code
    //   AND d.co_id = e.emp_id
    //   AND a.branch_code IN (${data.branch_code}) AND b.period_mode = '${data.period_mode}' AND b.recovery_day BETWEEN '${data.from_day}' AND '${data.to_day}'`,
    // order = `GROUP BY a.demand_date, a.branch_code, c.branch_name,a.group_code, d.group_name, d.co_id, e.emp_name,b.disb_dt,b.curr_roi, b.period, b.period_mode,b.recovery_day,b.instl_start_dt,b.instl_end_dt
    // ORDER BY d.group_code`;
    var select = `demand_date,branch_code,branch_name,
                  group_cd, group_name,co_id, emp_name,
                  disb_dt, SUM(disb_amt)AS disb_amt,curr_roi, loan_period,period_mode,
                  recovery_day  AS recovery_day,instl_start_dt,instl_end_dt,
                  SUM(tot_emi) AS tot_emi, SUM(demand_amt) AS demand_amt,
                  SUM(coll_amt) AS coll_amt, SUM(curr_outstanding) AS curr_outstanding 
                  FROM(
		                  SELECT DATE_FORMAT(a.demand_date, '%M %Y') AS demand_date,a.branch_code,c.branch_name,
		                  a.group_cd, d.group_name,d.co_id, e.emp_name,
		                  b.disb_dt, SUM(b.prn_disb_amt) AS disb_amt,b.curr_roi, b.period AS loan_period,b.period_mode,
		                  b.recovery_day  AS recovery_day,b.instl_start_dt,b.instl_end_dt,
		                  SUM(b.tot_emi) AS tot_emi, SUM(a.dmd_amt) AS demand_amt,
		                  0 AS coll_amt, SUM(b.prn_amt + b.intt_amt) AS curr_outstanding
		                  FROM td_loan_month_demand a, td_loan b, md_branch c, md_group d, md_employee e
		                  WHERE a.loan_id = b.loan_id
		                        AND a.branch_code = c.branch_code
		                        AND a.group_cd = d.group_code
		                        AND d.co_id = e.emp_id
		                        AND a.branch_code IN (${data.branch_code})  
		                        AND a.demand_date = '${create_date}'
                            AND b.period_mode = '${data.period_mode}' AND b.recovery_day BETWEEN '${data.from_day}' AND '${data.to_day}'
		                  GROUP BY a.demand_date, a.branch_code, c.branch_name,a.group_cd, d.group_name, d.co_id, 
		                  	 e.emp_name,b.disb_dt,b.curr_roi, b.period, b.period_mode,b.recovery_day,
		                  	 b.instl_start_dt,b.instl_end_dt
		              UNION
		                  SELECT DATE_FORMAT(a.demand_date, '%M %Y') AS demand_date,a.branch_code,c.branch_name,
		                  a.group_cd, d.group_name,d.co_id, e.emp_name,
		                  b.disb_dt, 0 AS disb_amt,b.curr_roi, b.period AS loan_period,b.period_mode,
		                  b.recovery_day  AS recovery_day,b.instl_start_dt,b.instl_end_dt,
		                  0 AS tot_emi, 0 AS demand_amt,
		                  SUM(f.credit) AS coll_amt, 0 AS curr_outstanding
		                  FROM td_loan_month_demand a, td_loan b, md_branch c, md_group d, md_employee e, td_loan_transactions f
		                  WHERE a.loan_id = b.loan_id
		                  AND a.loan_id = f.loan_id
		                      AND a.branch_code = c.branch_code
		                      AND a.group_cd = d.group_code
		                      AND d.co_id = e.emp_id
		                      AND a.branch_code IN (${data.branch_code})  
		                      AND a.demand_date = '${create_date}'
		                      AND f.payment_date BETWEEN '${first_create_date}' AND '${create_date}'
                          AND b.period_mode = '${data.period_mode}' AND b.recovery_day BETWEEN '${data.from_day}' AND '${data.to_day}'
		                  GROUP BY a.demand_date, a.branch_code, c.branch_name,a.group_cd, d.group_name, d.co_id, 
			                e.emp_name,b.disb_dt,b.curr_roi, b.period, b.period_mode,b.recovery_day,
			                b.instl_start_dt,b.instl_end_dt
		                  )a	
	          GROUP BY demand_date,branch_code,branch_name,group_cd, group_name,co_id, emp_name,
                     disb_dt, curr_roi,loan_period,period_mode,recovery_day ,instl_start_dt,instl_end_dt
            ORDER BY group_cd`,
    table_name = null,
    whr = null,
    order = null;
    var groupwise_demand_collec_data_day = await db_Select(select,table_name,whr,order);
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
     
      var select = `a.demand_date,a.branch_code, c.branch_name,a.group_code, d.group_name, d.co_id, e.emp_name,b.fund_id,f.fund_name,b.period_mode,b.recovery_day AS recovery_day,SUM(a.dmd_amt) AS demand_amt,SUM(a.coll_amt) AS coll_amt, SUM(a.prn_amt + a.intt_amt) AS curr_outstanding`,
     table_name = "tt_loan_demand a LEFT JOIN td_loan b ON a.branch_code = b.branch_code AND a.loan_id = b.loan_id LEFT JOIN md_branch c ON a.branch_code = c.branch_code LEFT JOIN md_group d ON a.group_code = d.group_code LEFT JOIN md_employee e ON d.co_id = e.emp_id LEFT JOIN md_fund f ON b.fund_id = f.fund_id",
     whr = `a.branch_code IN (${data.branch_code})
       AND b.fund_id IN (${data.fund_id}) AND b.period_mode = '${data.period_mode}' AND b.recovery_day BETWEEN '${data.from_day}' AND '${data.to_day}'`,
     order = `GROUP BY a.demand_date, a.branch_code, c.branch_name,a.group_code, d.group_name, d.co_id, e.emp_name,b.fund_id,f.fund_name,b.period_mode,b.recovery_day`;
     var fund_demand_collec_data_day = await db_Select(select,table_name,whr,order);
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
     
      var select = `a.demand_date,a.branch_code, c.branch_name,a.group_code, d.group_name, d.co_id, e.emp_name,
         b.period_mode,b.recovery_day AS recovery_day,SUM(b.tot_emi) tot_emi,SUM(a.dmd_amt) AS demand_amt,
         SUM(a.coll_amt) AS coll_amt, SUM(a.prn_amt + a.intt_amt) AS curr_outstanding`,
     table_name = "tt_loan_demand a LEFT JOIN td_loan b ON a.branch_code = b.branch_code AND a.loan_id = b.loan_id LEFT JOIN md_branch c ON a.branch_code = c.branch_code LEFT JOIN md_group d ON a.group_code = d.group_code LEFT JOIN md_employee e ON d.co_id = e.emp_id",
     whr = `a.branch_code IN (${data.branch_code})
       AND d.co_id IN (${data.co_id}) AND b.period_mode = '${data.period_mode}' AND b.recovery_day BETWEEN '${data.from_day}' AND '${data.to_day}'`,
     order = `GROUP BY a.demand_date, a.branch_code, c.branch_name,a.group_code, d.group_name, d.co_id, e.emp_name,
         b.period_mode,b.recovery_day`;
     var co_demand_collec_data_day = await db_Select(select,table_name,whr,order);
     res.send({
       co_demand_collec_data_day,
       dateRange: `BETWEEN '${first_create_date}' AND '${create_date}'`
     });
   } catch (error) {
     console.error("Error fetching demand vs collection report cowise:", error);
     res.send({ suc: 0, msg: "An error occurred" });
   }
});


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
     
    var select = `DATE_FORMAT(a.demand_date, '%M %Y') AS demand_date,
    a.branch_code,c.branch_name,
    a.loan_id,a.member_code,f.client_name,f.client_mobile,
    a.group_code, d.group_name, d.co_id, e.emp_name,
    b.disb_dt,b.prn_disb_amt AS disb_amt,
    b.curr_roi, b.period AS loan_period, b.period_mode,
    b.recovery_day AS recovery_day,
    b.instl_start_dt,b.instl_end_dt,
    b.tot_emi AS tot_emi, a.dmd_amt AS demand_amt,
    a.coll_amt AS coll_amt,(a.prn_amt + a.intt_amt) AS curr_outstanding`,
    table_name = "tt_loan_demand a,td_loan b,md_branch c,md_group d,md_employee e,md_member f",
    whr = `a.loan_id = b.loan_id
           AND a.branch_code = c.branch_code
           AND a.group_code = d.group_code
           AND d.co_id = e.emp_id
           AND a.member_code = f.member_code
           AND a.branch_code IN (${data.branch_code})
           AND b.period_mode = '${data.period_mode}' 
           AND b.recovery_day BETWEEN '${data.from_day}' AND '${data.to_day}'`,
    order = `ORDER BY a.loan_id`;       
     var member_demand_collec_data_day = await db_Select(select,table_name,whr,order);
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