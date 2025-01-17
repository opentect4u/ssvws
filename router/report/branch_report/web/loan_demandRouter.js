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
loan_demandRouter.post("/loan_demand_report_membwise", async (req, res) => {
    try {
                var data = req.body;

                 // Fetch loan details from recovery day
                 const pro_name = 'p_loan_demand',
                 pro_params = `?,?,?`,
                 pro_params_val = [data.from_dt, data.to_dt, data.branch_code],
                 sel_table_name = `tt_loan_demand a,vw_loan_demand_report b`,
                 sel_fields = `a.loan_id,a.member_code,b.client_name,a.group_code,b.group_name,a.disbursed_date,a.disbursed_amount,a.current_roi,a.period,a.period_mode,a.recov_day,a.installment_end_date,a.total_emi,a.curr_dmd_amt demand,a.current_principal,b.co_name`,
                 sel_whr_fields = `a.loan_id = b.loan_id AND (a.curr_dmd_amt + a.current_principal) > 0`,
                 sel_whr_arr = [],
                 sel_order = `ORDER BY  a.loan_id`;
                 var loan_dt_membwise = await db_RunProcedureAndFetchData(pro_name, pro_params, pro_params_val, sel_fields, sel_table_name, sel_whr_fields, sel_whr_arr, sel_order);

                 res.send(loan_dt_membwise)

              //  if (loan_dt.suc > 0 && loan_dt.msg.length > 0) {
              //    var demandResults = [];

              //     for (let dt of loan_dt.msg) {
              //       var get_balance = await getLoanBal(dt.loan_id, data.to_dt);
              //       var demandData = await getLoanDmd(dt.loan_id, data.to_dt);
              //       dt['demand'] = demandData.demand.ld_demand
              //       dt['balance_dt'] = get_balance.balance
              //     }
              //    res.send(loan_dt)
              //   } else {
              //    res.send({ suc: 0, msg: [] });
              //   }

            } catch (error) {
              console.error("Error fetching demand report memberwise:", error);
              res.send({ suc: 0, msg: "An error occurred" });
          }
});


//GROUPWISE DEMAND REPORT
loan_demandRouter.post("/loan_demand_report_groupwise", async (req, res) => {
  try {
              var data = req.body;

               const pro_name = 'p_loan_demand',
               pro_params = `?,?,?`,
               pro_params_val = [data.from_dt, data.to_dt, data.branch_code],
               sel_table_name = `tt_loan_demand a,vw_loan_demand_report b`,
               sel_fields = `a.group_code,b.group_name,a.disbursed_date,sum(a.disbursed_amount)disbursed_amount,a.current_roi,a.period,a.period_mode,a.installment_end_date,sum(a.total_emi)total_emi,sum(a.curr_dmd_amt) demand,sum(a.current_principal)outstanding,b.co_name`,
               sel_whr_fields = `a.loan_id = b.loan_id AND (a.curr_dmd_amt + a.current_principal) > 0`,
               sel_whr_arr = [],
               sel_order = `GROUP BY a.group_code,b.group_name,a.disbursed_date,a.current_roi,a.period,a.period_mode,a.installment_end_date,b.co_name`;
               var loan_dt_groupwise = await db_RunProcedureAndFetchData(pro_name, pro_params, pro_params_val, sel_fields, sel_table_name, sel_whr_fields, sel_whr_arr, sel_order);

               res.send(loan_dt_groupwise)

          } catch (error) {
            console.error("Error fetching demand report groupwise:", error);
            res.send({ suc: 0, msg: "An error occurred" });
        }
});

//COWISE DEMAND REPORT
loan_demandRouter.post("/loan_demand_report_cowise", async (req, res) => {
    try {
        var data = req.body;
        const pro_name = 'p_loan_demand',
        pro_params = `?,?,?`,
        pro_params_val = [data.from_dt, data.to_dt, data.branch_code],
        sel_table_name = `tt_loan_demand a,vw_loan_demand_report b`,
        sel_fields = `a.loan_id,a.member_code,b.client_name,a.group_code,b.group_name,a.disbursed_date,a.disbursed_amount,a.current_roi,a.period,a.period_mode,a.recov_day,a.installment_end_date,a.total_emi,a.curr_dmd_amt demand,a.current_principal,b.co_name,b.collec_code`,
        sel_whr_fields = `a.loan_id = b.loan_id AND b.collec_code = '${data.co_id}' AND (a.curr_dmd_amt + a.current_principal) > 0`,
        sel_whr_arr = [],
        sel_order = `ORDER BY  a.loan_id`;
        var repo_data_cowise = await db_RunProcedureAndFetchData(pro_name, pro_params, pro_params_val, sel_fields, sel_table_name, sel_whr_fields, sel_whr_arr, sel_order);

        res.send(repo_data_cowise)

    } catch (error) {
        console.error("Error fetching demand vs collection report cowise:", error);
        res.send({ suc: 0, msg: "An error occurred" });
    }
});

module.exports = {loan_demandRouter}