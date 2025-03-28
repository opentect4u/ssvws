const { db_Select, db_Insert } = require('../../../../model/mysqlModel');
const { getLoanBal } = require('../../../../modules/api/masterModule');

const express = require('express'),
loan_outstanding_scheduler = express.Router(),
dateFormat = require('dateformat');

 //fetch branch with outstanding and demand flag N

//  loan_outstanding_scheduler.get("/loan_outstanding_scheduler", async (req, res) => {
//     try {
//         var data = req.query;
//         // console.log(data,'datas');

//         var select = "branch_code,closed_upto",
//             table_name = "td_month_close",
//             whr = `outstanding_flag = 'N'`,
//             order = null;

//         var data_branch = await db_Select(select, table_name, whr, order);

//         if (data_branch.suc > 0 && data_branch.msg.length > 0) {
//             var branch_codes = data_branch.msg.map(item => item.branch_code);
//             var closed_upto_data = data_branch.msg.map(item => item.closed_upto);
//             let loanData = [];
//             // console.log(closed_uptos,'log');
            

//             for (let branch_code of branch_codes) {
//                 let select = "branch_code,loan_id,(prn_amt + od_prn_amt) prn_amt,intt_amt",
//                     table_name = "td_loan",
//                     whr = `branch_code = '${branch_code}' AND outstanding > 0`,
//                     order = null;

//                 let data_loan = await db_Select(select, table_name, whr, order);
                
//                 if (data_loan.suc > 0 && data_loan.msg.length > 0) {
//                     loanData.push(...data_loan.msg);
//                 }
//             }

//             if (loanData.length === 0) {
//                 return res.json({ success: false, message: "No loans found with outstanding balance" });
//             }

//         // Fetch outstanding balance for each loan
//         // var closed_uptos = `${dateFormat(closed_upto_data,"yyyy-mm-dd" )}`;

//          let loanWithBalance = await Promise.all(
//             loanData.map(async (loan) => {
//                  // Ensure closed_upto_data is a valid Date before formatting
//                  if (!closed_upto_data || isNaN(new Date(closed_upto_data).getTime())) {
//                     throw new Error("Invalid date: closed_upto_data is not a valid date");
//                 }
//                 var closed_uptos = dateFormat(new Date(closed_upto_data), "yyyy-mm-dd");
//                 let outstandingBalance = await getLoanBal(loan.loan_id, closed_uptos );
//                 return { ...loan, outstandingBalance };
//             })
//         );

//        // Insert data into td_loan_month_balance
//        for (let loan of loanWithBalance) {

//         // Insert data into td_loan_month_balance
//          var balance = loan.outstandingBalance.balance || 0; // Use 0 if balance is not found

//           var table_name = "td_loan_month_balance",
//           fields = "(balance_date,loan_id,branch_code,prn_amt,intt_amt,outstanding,remarks)",
//           values = `('${dateFormat(closed_uptos,"yyyy-mm-dd")}','${loan.loan_id}','${loan.branch_code}','${loan.prn_amt}','${loan.intt_amt}','${balance}','To Closing')`,
//           whr = null,
//           flag = 0;
//           var loan_balance_data = await db_Insert(table_name,fields,values,whr,flag);
    
//        }
//             return res.json({ success: true, message: "Data inserted successfully", data: loanWithBalance });
//         } else {
//             return res.json({ success: false, message: "No branches found" });
//         }
//     } catch (error) {
//         console.error("Error:", error);
//         return res.json({ success: false, error: "Internal Server Error" });
//     }
// });

loan_outstanding_scheduler.get("/loan_outstanding_scheduler", async (req, res) => {
    try {
        var data = req.query;

        var select = "branch_code,LAST_DAY(closed_upto - interval 1 month)closed_upto_prev,closed_upto",
            table_name = "td_month_close",
            whr = `outstanding_flag = 'N'`,
            order = null;

        var data_branch = await db_Select(select, table_name, whr, order);

        if (data_branch.suc > 0 && data_branch.msg.length > 0) {

            for (let dt of data_branch.msg) {        //loop1
                // console.log(dt,'dt');

                let closed_upto_prev = dateFormat(dt.closed_upto_prev, "yyyy-mm-dd");
                let closed_upto = dateFormat(dt.closed_upto, "yyyy-mm-dd");

                var query = `SELECT loan_id FROM td_loan_month_balance
                WHERE branch_code = '${dt.branch_code}'
                AND balance_date = '${closed_upto_prev}'
                UNION
                SELECT loan_id FROM td_loan
                WHERE branch_code = '${dt.branch_code}'
                AND disb_dt > '${closed_upto_prev}'
                AND disb_dt <= '${closed_upto}'`
                var data_loan = await db_Select(null, null, null, null, true, query);
                // console.log(data_loan,'data_loan');
                

                if (data_loan.suc > 0 && data_loan.msg.length > 0) {
                    // let closed_uptos = dateFormat(new Date(dt.closed_upto), "yyyy-mm-dd");
                 for (let loan of data_loan.msg) {     
                              //loop2
                
                try {              
                let outstandingBalance = await getLoanBal(loan.loan_id, closed_upto,'O');
                let prnBalance = await getLoanBal(loan.loan_id, closed_upto,'P');
                let inttBalance = await getLoanBal(loan.loan_id, closed_upto,'I');

                let balance = outstandingBalance.balance || 0;
                let prnbalance = prnBalance.prn_amt || 0;
                let inttbalance = inttBalance.intt_amt || 0;
                // console.log(`Loan ID: ${loan.loan_id}, Balance: ${balance}, Principal: ${prnbalance}, Interest: ${inttbalance}`);
                

                if (balance > 0) {
                var table_name = "td_loan_month_balance",
                    fields = "(balance_date, loan_id, branch_code, prn_amt, intt_amt, outstanding, remarks)",
                    values = `('${closed_upto}', '${loan.loan_id}', '${dt.branch_code}', '${prnbalance}', '${inttbalance}', '${balance}', 'To Closing')`,
                    whr = null,
                    flag = 0;

                var loan_dt = await db_Insert(table_name, fields, values, whr, flag);
                }
            } catch (err) {
                console.error(`Error processing loan ${loan.loan_id}:`, err);
            }
            }   //end loop2
            }
            //update
            var table_name = "td_month_close",
            fields = `outstanding_flag = 'Y'`,
            values = null,
            whr = `branch_code = '${dt.branch_code}' AND closed_upto = '${closed_upto}'`,
            flag = 1;
            var update_outstanding_flag = await db_Insert(table_name, fields, values, whr, flag);

        }       //end loop1
            return res.json({ success: true, message: "Data inserted successfully"});
        } else {
            return res.json({ success: false, message: "No branches found" });
        }
    } catch (error) {
        console.error("Error:", error);
        return res.json({ success: false, error: "Internal Server Error" });
    }
});

module.exports = {loan_outstanding_scheduler}