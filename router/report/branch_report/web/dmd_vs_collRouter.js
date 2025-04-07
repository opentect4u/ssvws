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

dmd_vs_collRouter.post("/dmd_vs_collec_report_groupwise", async (req, res) => {
  try{
   var data = req.body;
   //last date of month 
   var date_query = `LAST_DAY(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01')) AS month_last_date`; 
   
   //first date of month
   var first_date_query = `STR_TO_DATE(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01'), '%Y-%m-%d') AS first_day_of_month;
`
   var dateResult = await db_Select(date_query);
   var first_dateResult = await db_Select(first_date_query);
//    console.log(dateResult,first_dateResult, 'dmy');

  //create first date and last date
   var create_date = dateFormat(dateResult.msg[0].month_last_date,'yyyy-mm-dd');
   var first_create_date = dateFormat(first_dateResult.msg[0].first_day_of_month,'yyyy-mm-dd');

   var select = `DATE_FORMAT(a.demand_date, '%M %Y') AS demand_date,CONCAT(DATE_FORMAT(STR_TO_DATE('${first_create_date}', '%Y-%m-%d'), '%M %Y'), ' to ', DATE_FORMAT(STR_TO_DATE('${create_date}', '%Y-%m-%d'), '%M %Y')) AS collec_upto,a.branch_code,c.branch_name,b.group_code,d.group_name,d.co_id,e.emp_name co_name,MAX(b.disb_dt)disb_dt,SUM(b.prn_disb_amt)disb_amt,b.curr_roi,b.period,b.period_mode, 
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
        END AS recovery_day,b.instl_start_dt,b.instl_end_dt,SUM(b.tot_emi)tot_emi,SUM(a.dmd_amt)demand_amt,SUM(f.credit)collection_amt,SUM(a.dmd_amt) - SUM(f.credit),SUM(b.outstanding)curr_outstanding`,
   table_name = `td_loan_month_demand a LEFT JOIN td_loan b ON a.branch_code = b.branch_code AND a.loan_id = b.loan_id LEFT JOIN md_branch c ON a.branch_code = c.branch_code LEFT JOIN md_group d ON b.group_code = d.group_code LEFT JOIN md_employee e ON d.co_id = e.emp_id LEFT JOIN td_loan_transactions f ON a.loan_id = f.loan_id`,
   whr = `a.branch_code IN (${data.branch_code}) AND a.demand_date = '${create_date}' AND f.payment_date BETWEEN '${first_create_date}' AND '${create_date}'`,
   order = `GROUP BY a.demand_date,a.branch_code,c.branch_name,b.group_code,d.group_name,d.co_id,e.emp_name,b.curr_roi,b.period,b.period_mode,b.instl_start_dt,b.instl_end_dt
   ORDER BY a.branch_code,b.recovery_day`;
   var groupwise_demand_collec_data = await db_Select(select,table_name,whr,order)
   res.send({groupwise_demand_collec_data, dateRange: `BETWEEN '${first_create_date}' AND '${create_date}'`});
  }catch(error){
        console.error("Error fetching demand vs collection report groupwise:", error);
        res.send({ suc: 0, msg: "An error occurred" });
    }
});

//DEMAND VS COLLECTION REPORT FUNDWISE

dmd_vs_collRouter.post("/dmd_vs_collec_report_fundwise", async (req, res) => {
 try{
    var data = req.body;
    //last date of month 
    var date_query = `LAST_DAY(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01')) AS month_last_date`; 
    
    //first date of month
    var first_date_query = `STR_TO_DATE(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01'), '%Y-%m-%d') AS first_day_of_month;
 `
    var dateResult = await db_Select(date_query);
    var first_dateResult = await db_Select(first_date_query);
 
   //create first date and last date
    var create_date = dateFormat(dateResult.msg[0].month_last_date,'yyyy-mm-dd');
    var first_create_date = dateFormat(first_dateResult.msg[0].first_day_of_month,'yyyy-mm-dd');

    var select = `DATE_FORMAT(a.demand_date, '%M %Y') AS demand_date,CONCAT(DATE_FORMAT(STR_TO_DATE('${first_create_date}', '%Y-%m-%d'), '%M %Y'), ' to ', DATE_FORMAT(STR_TO_DATE('${create_date}', '%Y-%m-%d'), '%M %Y')) AS collec_upto,a.branch_code,c.branch_name,b.group_code,d.group_name,d.co_id,e.emp_name co_name,b.fund_id,f.fund_name,b.period_mode, 
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
        END AS recovery_day,SUM(b.tot_emi)total_emi,SUM(a.dmd_amt)demand_amt,SUM(g.credit)collection_amt,SUM(a.dmd_amt) - SUM(g.credit),SUM(b.outstanding)curr_outstanding`,
    table_name = "td_loan_month_demand a LEFT JOIN td_loan b ON a.branch_code = b.branch_code AND a.loan_id = b.loan_id LEFT JOIN md_branch c ON a.branch_code = c.branch_code LEFT JOIN md_group d ON b.group_code = d.group_code LEFT JOIN md_employee e ON d.co_id = e.emp_id LEFT JOIN md_fund f ON b.fund_id = f.fund_id LEFT JOIN td_loan_transactions g ON a.loan_id = g.loan_id",
    whr = `a.branch_code IN (${data.branch_code}) AND a.demand_date = '${create_date}' AND b.fund_id = '${data.fund_id}' AND g.payment_date BETWEEN '${first_create_date}' AND '${create_date}'`,
    order = `GROUP BY a.demand_date,a.branch_code,c.branch_name,b.group_code,d.group_name,d.co_id,e.emp_name,b.fund_id,f.fund_name`;
    var fund_demand_collec_data = await db_Select(select,table_name,whr,order)
    res.send({fund_demand_collec_data, dateRange: `BETWEEN '${first_create_date}' AND '${create_date}'`});
 }catch(error){
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
 try{
    var data = req.body;
    //last date of month
    var date_query = `LAST_DAY(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01')) AS month_last_date`; 
    
    //first date of month
    var first_date_query = `STR_TO_DATE(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01'), '%Y-%m-%d') AS first_day_of_month;
 `
    var dateResult = await db_Select(date_query);
    var first_dateResult = await db_Select(first_date_query);
 
   //create first date and last date
    var create_date = dateFormat(dateResult.msg[0].month_last_date,'yyyy-mm-dd');
    var first_create_date = dateFormat(first_dateResult.msg[0].first_day_of_month,'yyyy-mm-dd');

    var select = `DATE_FORMAT(a.demand_date, '%M %Y') AS demand_date,CONCAT(DATE_FORMAT(STR_TO_DATE('${first_create_date}', '%Y-%m-%d'), '%M %Y'), ' to ', DATE_FORMAT(STR_TO_DATE('${create_date}', '%Y-%m-%d'), '%M %Y')) AS collec_upto,a.branch_code,c.branch_name,b.group_code,d.group_name,d.co_id,e.emp_name co_name,b.period_mode, 
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
        END AS recovery_day,SUM(b.tot_emi) total_emi,SUM(a.dmd_amt) demand_amt,SUM(f.credit)collection_amt,SUM(a.dmd_amt) - SUM(f.credit),SUM(b.outstanding) curr_outstanding`,
    table_name = "td_loan_month_demand a LEFT JOIN td_loan b ON a.branch_code = b.branch_code AND a.loan_id = b.loan_id LEFT JOIN md_branch c ON a.branch_code = c.branch_code LEFT JOIN md_group d ON b.group_code = d.group_code LEFT JOIN md_employee e ON d.co_id = e.emp_id LEFT JOIN td_loan_transactions f ON a.loan_id = f.loan_id",
    whr = `a.branch_code IN (${data.branch_code}) AND a.demand_date = '${create_date}' AND d.co_id IN (${data.co_id}) AND f.payment_date BETWEEN '${first_create_date}' AND '${create_date}'`,
    order = `GROUP BY a.demand_date,a.branch_code,c.branch_name,b.group_code,d.group_name,d.co_id,e.emp_name`;
    var co_demand_collec_data = await db_Select(select,table_name,whr,order);
    res.send({co_demand_collec_data, dateRange:`BETWEEN '${first_create_date}' AND '${create_date}'`});
}catch(error){
    console.error("Error fetching demand vs collection report cowise:", error);
    res.send({ suc: 0, msg: "An error occurred" });
} 
});

// DEMAND VS COLLECTION REPORT MEMBERWISE
dmd_vs_collRouter.post("/dmd_vs_collec_report_memberwise", async (req, res) => {
 try{
    var data = req.body;
    //last date of month
    var date_query = `LAST_DAY(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01')) AS month_last_date`; 
    
    //first date of month
    var first_date_query = `STR_TO_DATE(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01'), '%Y-%m-%d') AS first_day_of_month;
 `
    var dateResult = await db_Select(date_query);
    var first_dateResult = await db_Select(first_date_query);
 
   //create first date and last date
    var create_date = dateFormat(dateResult.msg[0].month_last_date,'yyyy-mm-dd');
    var first_create_date = dateFormat(first_dateResult.msg[0].first_day_of_month,'yyyy-mm-dd');

    var select = `DATE_FORMAT(a.demand_date, '%M %Y') AS demand_date,CONCAT(DATE_FORMAT(STR_TO_DATE('${first_create_date}', '%Y-%m-%d'), '%M %Y'), ' to ', DATE_FORMAT(STR_TO_DATE('${create_date}', '%Y-%m-%d'), '%M %Y')) AS collec_upto,a.branch_code,c.branch_name,b.loan_id,b.member_code,f.client_name,b.group_code,d.group_name,d.co_id,e.emp_name co_name,b.disb_dt,b.prn_disb_amt disb_amt,b.curr_roi,b.period,b.period_mode,CASE 
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
        END AS recovery_day,b.instl_start_dt,b.instl_end_dt,b.tot_emi,a.dmd_amt demand_amt,g.credit collection_amt,(a.dmd_amt - g.credit),b.outstanding curr_outstanding`,
    table_name = "td_loan_month_demand a LEFT JOIN td_loan b ON a.branch_code = b.branch_code AND a.loan_id = b.loan_id LEFT JOIN md_branch c ON a.branch_code = c.branch_code LEFT JOIN md_group d ON b.group_code = d.group_code LEFT JOIN md_employee e ON d.co_id = e.emp_id LEFT JOIN md_member f ON b.member_code = f.member_code LEFT JOIN td_loan_transactions g ON a.loan_id = g.loan_id",
    whr = `a.branch_code IN (${data.branch_code}) AND a.demand_date = '${create_date}' AND g.payment_date BETWEEN '${first_create_date}' AND '${create_date}'`,
    order = `ORDER BY a.demand_date,a.branch_code,c.branch_name,b.loan_id desc`;
    var member_demand_collec_data = await db_Select(select,table_name,whr,order);
    res.send({member_demand_collec_data, dateRange:`BETWEEN '${first_create_date}' AND '${create_date}'`});
 }catch(error){
    console.error("Error fetching demand vs collection report memberwise:", error);
    res.send({ suc: 0, msg: "An error occurred" });
} 
});

// DEMAND VS COLLECTION REPORT BRANCHWISE
dmd_vs_collRouter.post("/dmd_vs_collec_report_branchwise", async (req, res) => {
    try{
        var data = req.body;
        //last date of month
        var date_query = `LAST_DAY(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01')) AS month_last_date`; 
    
        //first date of month
        var first_date_query = `STR_TO_DATE(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01'), '%Y-%m-%d') AS first_day_of_month;
     `
        var dateResult = await db_Select(date_query);
        var first_dateResult = await db_Select(first_date_query);
     
       //create first date and last date
        var create_date = dateFormat(dateResult.msg[0].month_last_date,'yyyy-mm-dd');
        var first_create_date = dateFormat(first_dateResult.msg[0].first_day_of_month,'yyyy-mm-dd');

        var select = "DATE_FORMAT(a.demand_date, '%M %Y') AS demand_date,CONCAT(DATE_FORMAT(STR_TO_DATE('${first_create_date}', '%Y-%m-%d'), '%M %Y'), ' to ', DATE_FORMAT(STR_TO_DATE('${create_date}', '%Y-%m-%d'), '%M %Y')) AS collec_upto,a.branch_code,c.branch_name,SUM(b.tot_emi) total_ami,SUM(a.dmd_amt) demand_amt,SUM(d.credit) collection_amt,SUM(a.dmd_amt) - SUM(d.credit),SUM(b.outstanding) curr_outstanding",
        table_name = "td_loan_month_demand a LEFT JOIN td_loan b ON a.branch_code = b.branch_code AND a.loan_id = b.loan_id LEFT JOIN md_branch c ON a.branch_code = c.branch_code LEFT JOIN td_loan_transactions d ON a.loan_id = b.loan_id",
        whr = `a.branch_code IN (${data.branch_code}) AND a.demand_date = '${create_date}' AND d.payment_date BETWEEN '${first_create_date}' AND '${create_date}'`,
        order = `GROUP BY a.demand_date,a.branch_code,c.branch_name`;
        var branch_demand_collec_data = await db_Select(select,table_name,whr,order);
    res.send({branch_demand_collec_data, dateRange:`BETWEEN '${first_create_date}' AND '${create_date}'`});
    }catch(error){
        console.error("Error fetching demand vs collection report beanchwise:", error);
        res.send({ suc: 0, msg: "An error occurred" });
    } 
});

module.exports = {dmd_vs_collRouter}