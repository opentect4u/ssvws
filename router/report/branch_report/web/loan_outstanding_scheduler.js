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

        var select = "branch_code,closed_upto",
            table_name = "td_month_close",
            whr = `outstanding_flag = 'N'`,
            order = null;

        var data_branch = await db_Select(select, table_name, whr, order);

        if (data_branch.suc > 0 && data_branch.msg.length > 0) {
            let loanData = [];

            for (let branch of data_branch.msg) {
                let { branch_code, closed_upto } = branch;

                if (!closed_upto || isNaN(new Date(closed_upto).getTime())) {
                    console.error(`Invalid date for branch ${branch_code}:`, closed_upto);
                    continue; // Skip this branch if the date is invalid
                }

                let select = "branch_code,loan_id,(prn_amt + od_prn_amt) prn_amt,intt_amt",
                    table_name = "td_loan",
                    whr = `branch_code = '${branch_code}' AND outstanding > 0`,
                    order = null;

                let data_loan = await db_Select(select, table_name, whr, order);

                if (data_loan.suc > 0 && data_loan.msg.length > 0) {
                    for (let loan of data_loan.msg) {
                        loanData.push({ ...loan, closed_upto });
                    }
                }
            }

            if (loanData.length === 0) {
                return res.json({ success: false, message: "No loans found with outstanding balance" });
            }

            let loanWithBalance = await Promise.all(
                loanData.map(async (loan) => {
                    let closed_uptos = dateFormat(new Date(loan.closed_upto), "yyyy-mm-dd");
                    let outstandingBalance = await getLoanBal(loan.loan_id, closed_uptos);
                    return { ...loan, closed_uptos, outstandingBalance };
                })
            );

            for (let loan of loanWithBalance) {
                var balance = loan.outstandingBalance.balance || 0;

                var table_name = "td_loan_month_balance",
                    fields = "(balance_date,loan_id,branch_code,prn_amt,intt_amt,outstanding,remarks)",
                    values = `('${loan.closed_uptos}','${loan.loan_id}','${loan.branch_code}','${loan.prn_amt}','${loan.intt_amt}','${balance}','To Closing')`,
                    whr = null,
                    flag = 0;

                var loan_balance_data = await db_Insert(table_name, fields, values, whr, flag);
            }

            return res.json({ success: true, message: "Data inserted successfully", data: loanWithBalance });
        } else {
            return res.json({ success: false, message: "No branches found" });
        }
    } catch (error) {
        console.error("Error:", error);
        return res.json({ success: false, error: "Internal Server Error" });
    }
});

module.exports = {loan_outstanding_scheduler}