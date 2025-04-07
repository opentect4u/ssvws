const { db_Select, db_RunProcedureAndFetchData } = require('../../../../model/mysqlModel');
const { dayRevarseList, getLoanDmd, getLoanBal } = require('../../../../modules/api/masterModule');

const express = require('express'),
loan_demandRouter = express.Router(),
dateFormat = require('dateformat');

// loan_demandRouter.post("/loan_demand_report", async (req, res) => {
//     try {
//         var data = req.body;
//         // console.log(data, 'data');

//         // Extract day from from_dt

//         // var fromDayQuery = `EXTRACT(DAY FROM '${dateFormat(data.from_dt, "yyyy-mm-dd")}') AS from_day`;
//         // var fromDayResult = await db_Select(fromDayQuery);
//         // var fromdt = fromDayResult.msg[0].from_day;
//         var fromdt = dateFormat(data.from_dt, "dd");
//         // console.log(fromdt, 'fromdt');

//         // Extract day from to_dt

//         // var toDayQuery = `EXTRACT(DAY FROM '${dateFormat(data.to_dt, "yyyy-mm-dd")}') AS to_day`;
//         // var toDayResult = await db_Select(toDayQuery);
//         // var todt = toDayResult.msg[0].to_day;
//         var todt = dateFormat(data.to_dt, "dd")
//         // console.log(todt, 'todt');

//         // Extract day of the week from the current date

//         var selDayNum = dayRevarseList[dateFormat(data.to_dt, 'dddd')];
//         // console.log(selDayNum, 'selDayNum');

//         // Fetch loan details from recovery day

//         var select = "*",
//         table_name = "vw_loan_demand_report",
//         whr = `branch_code = '${data.branch_code}' AND disb_dt <= '${data.to_dt}' AND 
//                      ((recovery_day BETWEEN '${fromdt}' AND '${todt}') OR (recovery_day = '${selDayNum}'))`,
//         order = `ORDER BY loan_id,group_code`;
//         var loan_dt = await db_Select(select, table_name, whr, order);
//         // console.log(loan_dt, 'loan_dt');

//         if (loan_dt.suc > 0 && loan_dt.msg.length > 0) {
//             var demandResults = [];

//             for (let dt of loan_dt.msg) {
//                 var get_balance = await getLoanBal(dt.loan_id, data.to_dt);
//                 var demandData = await getLoanDmd(dt.loan_id, data.to_dt);
//                 dt['demand'] = demandData.demand.ld_demand
//                 dt['balance_dt'] = get_balance.balance
//             }

//             // for (let dt of loan_dt.msg) {
//             //     var loan_id = dt.loan_id;
//             //     var branch_code = dt.branch_code;
//             //     var group_code = dt.group_code;
//             //     var group_name = dt.group_name;
//             //     var member_code = dt.member_code;
//             //     var client_name = dt.client_name;
//             //     var disb_dt = `${dateFormat(dt.disb_dt, "yyyy-mm-dd")}`;
//             //     var curr_roi = dt.curr_roi;
//             //     var period = dt.period;
//             //     var period_mode = dt.period_mode;
//             //     var co_name = dt.co_name;
//             //     var tot_emi = dt.tot_emi;
//             //     var instl_end_dt = dt.instl_end_dt;

//             //     // Calculate balance

//             //     var get_balance = await getLoanBal(loan_id, data.to_dt);
//             //     console.log(loan_id, data.to_dt,get_balance,'oooo');
                


              
                 
//             //     // Check balance
//             //     // if (details.suc > 0 && details.msg.length > 0) {
//             //             // if (details.msg[0].balance > 0) {

//             //                  var balance_dt = get_balance.balance
//             //                     //console.log(balance_dt,'balance_dt');
                
//             //                  var demandData = await getLoanDmd(loan_id, data.to_dt);

//             //                 // if(demandData.suc > 0 && demandData.demand.ld_demand > 0){
//             //                     demandResults.push({ loan_id,branch_code,group_code,group_name,member_code,client_name,disb_dt,curr_roi,period,period_mode,co_name,tot_emi,balance_dt,instl_end_dt, demand: demandData.demand.ld_demand });
//             //                 // }
                
//             //     // } else {
//             //     //     // console.log(`Loan ID ${loan_id}: Balance is 0.`);
//             //     // }
//             // }

//             // res.send({ suc: 1, msg: demandResults });
//             res.send(loan_dt)
//         } else {
//             res.send({ suc: 0, msg: [] });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ suc: 0, msg: 'Internal Server Error' });
//     }
// });


//MEMBERWISE DEMAND REPORT
// loan_demandRouter.post("/loan_demand_report_membwise", async (req, res) => {
//     try {
//                 var data = req.body;

//                  // Fetch loan details from recovery day
//                  const pro_name = 'p_loan_demand',
//                  pro_params = `?,?,?`,
//                  pro_params_val = [data.from_dt, data.to_dt, data.branch_code],
//                  sel_table_name = `tt_loan_demand a,vw_loan_demand_report b`,
//                  sel_fields = `a.loan_id,a.member_code,b.client_name,a.group_code,b.group_name,a.disbursed_date,a.disbursed_amount,a.current_roi,a.period,a.period_mode,a.recov_day,a.installment_end_date,a.total_emi,a.curr_dmd_amt demand,a.current_principal,b.co_name`,
//                  sel_whr_fields = `a.loan_id = b.loan_id AND (a.curr_dmd_amt + a.current_principal) > 0`,
//                  sel_whr_arr = [],
//                  sel_order = `ORDER BY  a.loan_id`;
//                  var loan_dt_membwise = await db_RunProcedureAndFetchData(pro_name, pro_params, pro_params_val, sel_fields, sel_table_name, sel_whr_fields, sel_whr_arr, sel_order);

//                  res.send(loan_dt_membwise)

//               //  if (loan_dt.suc > 0 && loan_dt.msg.length > 0) {
//               //    var demandResults = [];

//               //     for (let dt of loan_dt.msg) {
//               //       var get_balance = await getLoanBal(dt.loan_id, data.to_dt);
//               //       var demandData = await getLoanDmd(dt.loan_id, data.to_dt);
//               //       dt['demand'] = demandData.demand.ld_demand
//               //       dt['balance_dt'] = get_balance.balance
//               //     }
//               //    res.send(loan_dt)
//               //   } else {
//               //    res.send({ suc: 0, msg: [] });
//               //   }

//             } catch (error) {
//               console.error("Error fetching demand report memberwise:", error);
//               res.send({ suc: 0, msg: "An error occurred" });
//           }
// });


//GROUPWISE DEMAND REPORT
// loan_demandRouter.post("/loan_demand_report_groupwise", async (req, res) => {
//   try {
//               var data = req.body;

//                const pro_name = 'p_loan_demand',
//                pro_params = `?,?,?`,
//                pro_params_val = [data.from_dt, data.to_dt, data.branch_code],
//                sel_table_name = `tt_loan_demand a,vw_loan_demand_report b`,
//                sel_fields = `a.group_code,b.group_name,a.disbursed_date,sum(a.disbursed_amount)disbursed_amount,a.current_roi,a.period,a.period_mode,a.installment_end_date,sum(a.total_emi)total_emi,sum(a.curr_dmd_amt) demand,sum(a.current_principal)outstanding,b.co_name`,
//                sel_whr_fields = `a.loan_id = b.loan_id AND (a.curr_dmd_amt + a.current_principal) > 0`,
//                sel_whr_arr = [],
//                sel_order = `GROUP BY a.group_code,b.group_name,a.disbursed_date,a.current_roi,a.period,a.period_mode,a.installment_end_date,b.co_name`;
//                var loan_dt_groupwise = await db_RunProcedureAndFetchData(pro_name, pro_params, pro_params_val, sel_fields, sel_table_name, sel_whr_fields, sel_whr_arr, sel_order);

//                res.send(loan_dt_groupwise)

//           } catch (error) {
//             console.error("Error fetching demand report groupwise:", error);
//             res.send({ suc: 0, msg: "An error occurred" });
//         }
// });

//COWISE DEMAND REPORT
// loan_demandRouter.post("/loan_demand_report_cowise", async (req, res) => {
//     try {
//         var data = req.body;
//         const pro_name = 'p_loan_demand',
//         pro_params = `?,?,?`,
//         pro_params_val = [data.from_dt, data.to_dt, data.branch_code],
//         sel_table_name = `tt_loan_demand a,vw_loan_demand_report b`,
//         sel_fields = `a.loan_id,a.member_code,b.client_name,a.group_code,b.group_name,a.disbursed_date,a.disbursed_amount,a.current_roi,a.period,a.period_mode,a.recov_day,a.installment_end_date,a.total_emi,a.curr_dmd_amt demand,a.current_principal,b.co_name,b.collec_code`,
//         sel_whr_fields = `a.loan_id = b.loan_id AND b.collec_code = '${data.co_id}' AND (a.curr_dmd_amt + a.current_principal) > 0`,
//         sel_whr_arr = [],
//         sel_order = `ORDER BY  a.loan_id`;
//         var repo_data_cowise = await db_RunProcedureAndFetchData(pro_name, pro_params, pro_params_val, sel_fields, sel_table_name, sel_whr_fields, sel_whr_arr, sel_order);

//         res.send(repo_data_cowise)

//     } catch (error) {
//         console.error("Error fetching demand vs collection report cowise:", error);
//         res.send({ suc: 0, msg: "An error occurred" });
//     }
// });



// loan demand report groupwise 02.04.2025

loan_demandRouter.post("/loan_demand_report_groupwise", async (req, res) => {
    try {
        var data = req.body;
        var date_query = `LAST_DAY(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01')) AS month_last_date`; 

        var dateResult = await db_Select(date_query);
        // console.log(dateResult, 'dmy');
        var create_date = dateFormat(dateResult.msg[0].month_last_date,'yyyy-mm-dd');
        // console.log("Created date:", create_date);

        var select = `DATE_FORMAT(a.demand_date, '%M %Y') AS demand_date,a.branch_code,c.branch_name,b.group_code,d.group_name,d.co_id,e.emp_name co_name,MAX(b.disb_dt)disb_dt,SUM(b.prn_disb_amt)disb_amt,b.curr_roi,b.period,b.period_mode, 
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
        END AS recovery_day, MAX(b.instl_start_dt)AS instl_start_dt, MAX(b.instl_end_dt) AS instl_end_dt,SUM(b.tot_emi)tot_emi,SUM(a.dmd_amt)demand_amt,SUM(b.outstanding)curr_outstanding`,
        table_name = "td_loan_month_demand a LEFT JOIN td_loan b ON a.branch_code = b.branch_code AND a.loan_id = b.loan_id LEFT JOIN md_branch c ON a.branch_code = c.branch_code LEFT JOIN md_group d ON b.group_code = d.group_code LEFT JOIN md_employee e ON d.co_id = e.emp_id",
        whr = `a.branch_code IN (${data.branch_code}) AND a.demand_date = '${create_date}'`,
        order = `GROUP BY a.demand_date,a.branch_code,c.branch_name,b.group_code,d.group_name,d.co_id,e.emp_name,b.curr_roi,b.period,b.period_mode,b.instl_start_dt,b.instl_end_dt
        ORDER BY a.branch_code,b.group_code,b.recovery_day`;
        var groupwise_demand_data = await db_Select(select,table_name,whr,order);

         // Separate demand_date fetch
        //  var demand_date_result = await db_Select("MAX(demand_date) AS demand_date", "td_loan_month_demand", `branch_code IN (${data.branch_code})`);
        //  var demand_date = dateFormat(demand_date_result.msg[0].demand_date,'yyyy-mm-dd');
        // res.send({groupwise_demand_data,create_date,demand_date})
        res.send({groupwise_demand_data,create_date})
    }catch(error){
        console.error("Error fetching demand report groupwise:", error);
        res.send({ suc: 0, msg: "An error occurred" });
    }
});


// loan demand report fundwise 03.04.2025

loan_demandRouter.post("/loan_demand_report_fundwise", async (req, res) => {
    try {
        var data = req.body;
        var date_query = `LAST_DAY(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01')) AS month_last_date`; 

        var dateResult = await db_Select(date_query);
        var create_date = dateFormat(dateResult.msg[0].month_last_date,'yyyy-mm-dd');

        var select = `DATE_FORMAT(a.demand_date, '%M %Y') AS demand_date,a.branch_code,c.branch_name,b.group_code,d.group_name,d.co_id,e.emp_name co_name,b.fund_id,f.fund_name,b.period_mode, 
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
        END AS recovery_day,SUM(a.dmd_amt)demand_amt,SUM(b.outstanding)curr_outstanding`,
        table_name = "td_loan_month_demand a LEFT JOIN td_loan b ON a.branch_code = b.branch_code AND a.loan_id = b.loan_id LEFT JOIN md_branch c ON a.branch_code = c.branch_code LEFT JOIN md_group d ON b.group_code = d.group_code LEFT JOIN md_employee e ON d.co_id = e.emp_id LEFT JOIN md_fund f ON b.fund_id = f.fund_id",
        whr = `a.branch_code IN (${data.branch_code}) AND a.demand_date = '${create_date}' AND b.fund_id = '${data.fund_id}'`,
        order = `GROUP BY a.demand_date,a.branch_code,c.branch_name,b.group_code,d.group_name,d.co_id,e.emp_name,b.fund_id,f.fund_name
        ORDER BY a.branch_code,b.group_code,b.recovery_day`;
        var fundwise_demand_data = await db_Select(select,table_name,whr,order);

        // Separate demand_date fetch
        var demand_date_result = await db_Select("MAX(demand_date) AS demand_date", "td_loan_month_demand", `branch_code IN (${data.branch_code})`);
        var demand_date = dateFormat(demand_date_result.msg[0].demand_date,'yyyy-mm-dd');
        res.send({fundwise_demand_data,create_date})
    }catch(error){
        console.error("Error fetching demand report fundwise:", error);
        res.send({ suc: 0, msg: "An error occurred" });
    }
});

 loan_demandRouter.post("/fetch_brn_co_demand", async (req, res) => {
        var data = req.body;
    
         //FETCH BRANCHWISE CO NAME
        // var select = "a.emp_id,a.emp_name,b.user_type",
        // table_name = "md_employee a LEFT JOIN md_user b ON a.emp_id = b.emp_id",
        // whr = `a.branch_id = '${data.branch_code}' AND b.user_type = '1' AND b.user_status = 'A'`,
        // order = null;
        // var branch_co = await db_Select(select,table_name,whr,order);

        var select = "DISTINCT a.co_id,ifnull(b.emp_name,'NA')emp_name",
        table_name = "md_group a LEFT JOIN md_employee b ON a.co_id = b.emp_id",
        whr = `a.branch_code IN (${data.branch_code})`,
        order = null;
        var branch_co = await db_Select(select,table_name,whr,order);
    
        res.send(branch_co)
    });

// loan demand report cowise 03.04.2025

loan_demandRouter.post("/loan_demand_report_cowise", async (req, res) => {
    try {
        var data = req.body;
        var date_query = `LAST_DAY(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01')) AS month_last_date`; 

        var dateResult = await db_Select(date_query);
        var create_date = dateFormat(dateResult.msg[0].month_last_date,'yyyy-mm-dd');

        var select = `DATE_FORMAT(a.demand_date, '%M %Y') AS demand_date,a.branch_code,c.branch_name,b.group_code,d.group_name,d.co_id,e.emp_name co_name,b.period_mode, 
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
        END AS recovery_day,SUM(a.dmd_amt) demand_amt,SUM(b.outstanding) curr_outstanding`,
        table_name = "td_loan_month_demand a LEFT JOIN td_loan b ON a.branch_code = b.branch_code AND a.loan_id = b.loan_id LEFT JOIN md_branch c ON a.branch_code = c.branch_code LEFT JOIN md_group d ON b.group_code = d.group_code LEFT JOIN md_employee e ON d.co_id = e.emp_id",
        whr = `a.branch_code IN (${data.branch_code})AND a.demand_date = '${create_date}' AND d.co_id IN (${data.co_id})`,
        order = `GROUP BY a.demand_date,a.branch_code,c.branch_name,b.group_code,d.group_name,d.co_id,e.emp_name
        ORDER BY a.branch_code,b.group_code,b.recovery_day`;
        var cowise_demand_data = await db_Select(select,table_name,whr,order);

        // Separate demand_date fetch
        var demand_date_result = await db_Select("MAX(demand_date) AS demand_date", "td_loan_month_demand", `branch_code IN (${data.branch_code})`);
        var demand_date = dateFormat(demand_date_result.msg[0].demand_date,'yyyy-mm-dd');
        res.send({cowise_demand_data,create_date})
    }catch(error){
        console.error("Error fetching demand report cowise:", error);
        res.send({ suc: 0, msg: "An error occurred" });
    }
});

// loan demand report memberwise 03.04.2025
loan_demandRouter.post("/loan_demand_report_memberwise", async (req, res) => {
    try{
        var data = req.body;
        var date_query = `LAST_DAY(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01')) AS month_last_date`; 

        var dateResult = await db_Select(date_query);
        var create_date = dateFormat(dateResult.msg[0].month_last_date,'yyyy-mm-dd');

        var select = `DATE_FORMAT(a.demand_date, '%M %Y') AS demand_date,a.branch_code,c.branch_name,b.loan_id,b.member_code,f.client_name,b.group_code,d.group_name,d.co_id,e.emp_name co_name,b.disb_dt,b.prn_disb_amt disb_amt,b.curr_roi,b.period,b.period_mode, 
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
        END AS recovery_day, MAX(b.instl_start_dt)AS instl_start_dt, MAX(b.instl_end_dt) AS instl_end_dt,b.tot_emi,a.dmd_amt demand_amt,b.outstanding curr_outstanding`,
        table_name = "td_loan_month_demand a LEFT JOIN td_loan b ON a.branch_code = b.branch_code AND a.loan_id = b.loan_id LEFT JOIN md_branch c ON a.branch_code = c.branch_code LEFT JOIN md_group d ON b.group_code = d.group_code LEFT JOIN md_employee e ON d.co_id = e.emp_id LEFT JOIN md_member f ON b.member_code = f.member_code",
        whr = `a.branch_code IN (${data.branch_code}) AND a.demand_date = '${create_date}'`,
        order = "ORDER BY a.branch_code,b.group_code,b.recovery_day";
        var memberwise_demand_data = await db_Select(select,table_name,whr,order);

        // Separate demand_date fetch
        var demand_date_result = await db_Select("MAX(demand_date) AS demand_date", "td_loan_month_demand", `branch_code IN (${data.branch_code})`);
        var demand_date = dateFormat(demand_date_result.msg[0].demand_date,'yyyy-mm-dd');
        res.send({memberwise_demand_data,create_date})
    }catch(error){
        console.error("Error fetching demand report memberwise:", error);
        res.send({ suc: 0, msg: "An error occurred" });
    }
});

// loan demand report branchwise 03.04.2025
loan_demandRouter.post("/loan_demand_report_branchwise", async (req, res) => {
    try {
        var data = req.body;
        var date_query = `LAST_DAY(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01')) AS month_last_date`; 

        var dateResult = await db_Select(date_query);
        var create_date = dateFormat(dateResult.msg[0].month_last_date,'yyyy-mm-dd');

        var select = "DATE_FORMAT(a.demand_date, '%M %Y') AS demand_date,a.branch_code,c.branch_name,SUM(a.dmd_amt) demand_amt,SUM(b.outstanding) curr_outstanding",
        table_name = "td_loan_month_demand a LEFT JOIN td_loan b ON a.branch_code = b.branch_code AND a.loan_id = b.loan_id LEFT JOIN md_branch c ON a.branch_code = c.branch_code",
        whr = `a.branch_code IN (${data.branch_code}) AND a.demand_date = '${create_date}'`,
        order = "GROUP BY a.branch_code,c.branch_name"; 
        var branchwise_demand_data = await db_Select(select,table_name,whr,order);

        // Separate demand_date fetch
        var demand_date_result = await db_Select("MAX(demand_date) AS demand_date", "td_loan_month_demand", `branch_code IN (${data.branch_code})`);
        var demand_date = dateFormat(demand_date_result.msg[0].demand_date,'yyyy-mm-dd');
        res.send({branchwise_demand_data,create_date})
    }catch(error){
        console.error("Error fetching demand report branchwise:", error);
        res.send({ suc: 0, msg: "An error occurred" });
    }
});

//loan demand report groupwise via day

loan_demandRouter.post("/filter_dayawise_dmd_report_groupwise", async (req, res) => {
    try {
        var data = req.body;
        // console.log(data);
        

        var select = `a.demand_date,a.branch_code,c.branch_name,b.group_code,d.group_name,d.co_id,e.emp_name co_name,MAX(b.disb_dt)disb_dt,SUM(b.prn_disb_amt)disb_amt,b.curr_roi,b.period,b.period_mode, 
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
        END AS recovery_day,b.instl_start_dt,b.instl_end_dt,SUM(b.tot_emi)tot_emi,SUM(a.dmd_amt)demand_amt,SUM(b.outstanding)curr_outstanding`,
        table_name = "td_loan_month_demand a LEFT JOIN td_loan b ON a.branch_code = b.branch_code AND a.loan_id = b.loan_id LEFT JOIN md_branch c ON a.branch_code = c.branch_code LEFT JOIN md_group d ON b.group_code = d.group_code LEFT JOIN md_employee e ON d.co_id = e.emp_id",
        whr = `a.demand_date = '${data.demand_date}' AND b.period_mode = '${data.period_mode}' AND b.recovery_day BETWEEN '${data.from_day}' AND '${data.to_day}'`,
        order = `GROUP BY a.demand_date,a.branch_code,c.branch_name,b.group_code,d.group_name,d.co_id,e.emp_name,b.curr_roi,b.period,b.period_mode,b.instl_start_dt,b.instl_end_dt
        ORDER BY a.branch_code,b.recovery_day`;
        var groupwise_demand_data_day = await db_Select(select,table_name,whr,order);
        res.send({groupwise_demand_data_day})
    }catch(error){
        console.error("Error fetching demand report groupwise:", error);
        res.send({ suc: 0, msg: "An error occurred" });
    }
});
//loan demand report fundwise via day

loan_demandRouter.post("/filter_dayawise_dmd_report_fundwise", async (req, res) => {
    try {
        var data = req.body;

        var select = `a.demand_date,a.branch_code,c.branch_name,b.group_code,d.group_name,d.co_id,e.emp_name co_name,b.fund_id,f.fund_name,b.period_mode, 
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
        END AS recovery_day,SUM(a.dmd_amt)demand_amt,SUM(b.outstanding)curr_outstanding`,
        table_name = "td_loan_month_demand a LEFT JOIN td_loan b ON a.branch_code = b.branch_code AND a.loan_id = b.loan_id LEFT JOIN md_branch c ON a.branch_code = c.branch_code LEFT JOIN md_group d ON b.group_code = d.group_code LEFT JOIN md_employee e ON d.co_id = e.emp_id LEFT JOIN md_fund f ON b.fund_id = f.fund_id",
        whr = `a.demand_date = '${data.demand_date}' AND b.period_mode = '${data.period_mode}' AND b.recovery_day BETWEEN '${data.from_day}' AND '${data.to_day}'`,
        order = `GROUP BY a.demand_date,a.branch_code,c.branch_name,b.group_code,d.group_name,d.co_id,e.emp_name,b.fund_id,f.fund_name
        ORDER BY a.branch_code,b.recovery_day`;
        var fundwise_demand_data_day = await db_Select(select,table_name,whr,order);
        res.send({fundwise_demand_data_day})
    }catch(error){
        console.error("Error fetching demand report fundwise:", error);
        res.send({ suc: 0, msg: "An error occurred" });
    }
});

// loan demand report cowise via day

loan_demandRouter.post("/filter_dayawise_dmd_report_cowise", async (req, res) => {
    try {
        var data = req.body;

        var select = `a.demand_date,a.branch_code,c.branch_name,b.group_code,d.group_name,d.co_id,e.emp_name co_name,b.period_mode, 
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
        END AS recovery_day,SUM(a.dmd_amt) demand_amt,SUM(b.outstanding) curr_outstanding`,
        table_name = "td_loan_month_demand a LEFT JOIN td_loan b ON a.branch_code = b.branch_code AND a.loan_id = b.loan_id LEFT JOIN md_branch c ON a.branch_code = c.branch_code LEFT JOIN md_group d ON b.group_code = d.group_code LEFT JOIN md_employee e ON d.co_id = e.emp_id",
        whr = `a.demand_date = '${data.demand_date}' AND b.period_mode = '${data.period_mode}' AND b.recovery_day BETWEEN '${data.from_day}' AND '${data.to_day}'`,
        order = `GROUP BY a.demand_date,a.branch_code,c.branch_name,b.group_code,d.group_name,d.co_id,e.emp_name
        ORDER BY a.branch_code,b.recovery_day`;
        var cowise_demand_data_day = await db_Select(select,table_name,whr,order);
        res.send({cowise_demand_data_day})
    }catch(error){
        console.error("Error fetching demand report cowise:", error);
        res.send({ suc: 0, msg: "An error occurred" });
    }
});

// loan demand report memberwise via day
loan_demandRouter.post("/filter_dayawise_dmd_report_membwise", async (req, res) => {
    try{
        var data = req.body;
       
        var select = `a.demand_date,a.branch_code,c.branch_name,b.loan_id,b.member_code,f.client_name,b.group_code,d.group_name,d.co_id,e.emp_name co_name,b.disb_dt,b.prn_disb_amt disb_amt,b.curr_roi,b.period,b.period_mode, 
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
        END AS recovery_day,b.instl_start_dt,b.instl_end_dt,b.tot_emi,a.dmd_amt demand_amt,b.outstanding curr_outstanding`,
        table_name = "td_loan_month_demand a LEFT JOIN td_loan b ON a.branch_code = b.branch_code AND a.loan_id = b.loan_id LEFT JOIN md_branch c ON a.branch_code = c.branch_code LEFT JOIN md_group d ON b.group_code = d.group_code LEFT JOIN md_employee e ON d.co_id = e.emp_id LEFT JOIN md_member f ON b.member_code = f.member_code",
        whr = `a.demand_date = '${data.demand_date}' AND b.period_mode = '${data.period_mode}' AND b.recovery_day BETWEEN '${data.from_day}' AND '${data.to_day}'`,
        order = "ORDER BY a.branch_code,b.recovery_day";
        var memberwise_demand_data_day = await db_Select(select,table_name,whr,order);
        res.send({memberwise_demand_data_day})
    }catch(error){
        console.error("Error fetching demand report memberwise:", error);
        res.send({ suc: 0, msg: "An error occurred" });
    }
});

module.exports = {loan_demandRouter}