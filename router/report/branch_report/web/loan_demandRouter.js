const { db_Select } = require('../../../../model/mysqlModel');
const { dayRevarseList, getLoanDmd, getLoanBal } = require('../../../../modules/api/masterModule');

const express = require('express'),
loan_demandRouter = express.Router(),
dateFormat = require('dateformat');

loan_demandRouter.post("/loan_demand_report", async (req, res) => {
    try {
        var data = req.body;
        // console.log(data, 'data');

        // Extract day from from_dt

        var fromDayQuery = `EXTRACT(DAY FROM '${dateFormat(data.from_dt, "yyyy-mm-dd")}') AS from_day`;
        var fromDayResult = await db_Select(fromDayQuery);
        var fromdt = fromDayResult.msg[0].from_day;
        // console.log(fromdt, 'fromdt');

        // Extract day from to_dt

        var toDayQuery = `EXTRACT(DAY FROM '${dateFormat(data.to_dt, "yyyy-mm-dd")}') AS to_day`;
        var toDayResult = await db_Select(toDayQuery);
        var todt = toDayResult.msg[0].to_day;
        // console.log(todt, 'todt');

        // Extract day of the week from the current date

        var selDayNum = dayRevarseList[dateFormat(data.to_dt, 'dddd')];
        // console.log(selDayNum, 'selDayNum');

        // Fetch loan details from recovery day

        var select = "a.loan_id,a.branch_code,a.group_code,b.group_name,a.member_code,c.client_name,a.disb_dt,a.curr_roi,a.period,a.period_mode,a.instl_end_dt,a.tot_emi,b.created_by collec_code,d.emp_name co_name",
        table_name = "td_loan a LEFT JOIN md_group b ON a.group_code = b.group_code LEFT JOIN md_member c ON a.member_code = c.member_code LEFT JOIN md_employee d ON b.created_by = d.emp_id",
        whr = `a.branch_code = '${data.branch_code}' AND a.disb_dt <= '${data.to_dt}' AND 
                     (a.recovery_day BETWEEN '${fromdt}' AND '${todt}' OR a.recovery_day = '${selDayNum}')`,
        order = `ORDER BY a.loan_id,a.group_code`;
        var loan_dt = await db_Select(select, table_name, whr, order);
        // console.log(loan_dt, 'loan_dt');

        if (loan_dt.suc > 0 && loan_dt.msg.length > 0) {
            var demandResults = [];

            for (let dt of loan_dt.msg) {
                var loan_id = dt.loan_id;
                var branch_code = dt.branch_code;
                var group_code = dt.group_code;
                var group_name = dt.group_name;
                var member_code = dt.member_code;
                var client_name = dt.client_name;
                var disb_dt = `${dateFormat(dt.disb_dt, "yyyy-mm-dd")}`;
                var curr_roi = dt.curr_roi;
                var period = dt.period;
                var period_mode = dt.period_mode;
                var co_name = dt.emp_name;
                var tot_emi = dt.tot_emi;
                var instl_end_dt = dt.instl_end_dt;

                // Calculate balance

                var get_balance = await getLoanBal(loan_id, data.to_dt);


                // var select = "(balance + od_balance + intt_balance) balance";
                // table_name = "td_loan_transactions";
                // whr = `loan_id = '${loan_id}' AND tr_type = 'R'
                //                     AND payment_date = (SELECT MAX(payment_date)
                //                                     FROM td_loan_transactions
                //                                     WHERE loan_id = '${loan_id}' 
                //                                     AND payment_date <= '${data.to_dt}'
                //                                     AND tr_type = 'R')`;
                // var details = await db_Select(select, table_name, whr, null);
                // console.log(details, 'details');
                 
                // Check balance
                // if (details.suc > 0 && details.msg.length > 0) {
                        // if (details.msg[0].balance > 0) {

                             var balance_dt = get_balance.msg[0].balance
                                // console.log(balance_dt,'balance');
                
                             var demandData = await getLoanDmd(loan_id, data.to_dt);

                            // if(demandData.suc > 0 && demandData.demand.ld_demand > 0){
                                demandResults.push({ loan_id,branch_code,group_code,group_name,member_code,client_name,disb_dt,curr_roi,period,period_mode,co_name,tot_emi,balance_dt,instl_end_dt, demand: demandData.demand.ld_demand });
                            // }else {
                            // }
                        // }
                
                // } else {
                //     // console.log(`Loan ID ${loan_id}: Balance is 0.`);
                // }
            }

            res.send({ suc: 1, msg: demandResults });
        } else {
            res.send({ suc: 0, msg: [] });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ suc: 0, msg: 'Internal Server Error' });
    }
});

module.exports = {loan_demandRouter}